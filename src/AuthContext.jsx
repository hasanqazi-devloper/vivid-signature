import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { getSignature } from "./db";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// ── ACCESS CODES — community codes that unlock enterprise features but keep branding ──
const ACCESS_CODES = {
    AIAUTOMATOR: { tier: "enterprise", brandingLocked: true, label: "AI Automations by Jack" },
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [savedSignature, setSavedSignature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessCodeData, setAccessCodeData] = useState(() => {
        const stored = localStorage.getItem('vsp_access_code');
        return stored ? ACCESS_CODES[stored] || null : null;
    });

    useEffect(() => {
        // Dev auto-login — remove for production
        if (!localStorage.getItem('wcs_secure_bypass') && window.location.hostname === 'localhost') {
            localStorage.setItem('wcs_secure_bypass', JSON.stringify({
                uid: "admin-justin",
                email: "justin@watermancm.pro",
                displayName: "Justin Waterman",
                tier: "enterprise",
                role: "owner",
                hasPaidSubscription: true,
            }));
        }

        // Mock Bypass Check
        const bypass = localStorage.getItem('wcs_secure_bypass');
        if (bypass) {
            const mockUser = JSON.parse(bypass);
            setCurrentUser(mockUser);
            setUserProfile(mockUser);
            setSavedSignature(null);
            setLoading(false);
            return;
        }

        // Check for pending OAuth redirect result
        if (auth) {
            getRedirectResult(auth).catch(() => {});
        }

        let unsubscribeProfile = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            // Clean up previous profile listener when user changes
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            setCurrentUser(user);

            if (user) {
                const userRef = doc(db, "users", user.uid);

                // Real-time listener — auto-refreshes when Stripe webhook updates tier
                unsubscribeProfile = onSnapshot(userRef, async (snap) => {
                    if (snap.exists()) {
                        setUserProfile(snap.data());
                    } else {
                        // New user defaults (free tier)
                        const newProfile = {
                            email: user.email,
                            displayName: user.displayName || "",
                            tier: "free",
                            isPaid: false,
                            createdAt: new Date().toISOString(),
                        };
                        await setDoc(userRef, newProfile);
                        setUserProfile(newProfile);
                    }
                    setLoading(false);
                }, (err) => {
                    console.error("Firestore profile listener error:", err);
                    setLoading(false);
                });

                // Fetch user's saved signature from vault
                try {
                    const savedSig = await getSignature(user.uid);
                    setSavedSignature(savedSig?.config ?? null);
                } catch (err) {
                    console.error("Failed to load signature vault:", err);
                }
            } else {
                setUserProfile(null);
                setSavedSignature(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    // Owner override — grants enterprise access to the account owner
    const OWNER_EMAIL = "watermanconsultingservices@gmail.com";
    const isOwner = currentUser?.email === OWNER_EMAIL;

    // Privileged accounts — full enterprise, branding always unlocked
    const PRIVILEGED_EMAILS = ["jfloyd@leadvalets.com", "hasanqazi42@gmail.com"];
    const isPrivileged = PRIVILEGED_EMAILS.includes(currentUser?.email);

    // Access code — unlocks features but keeps branding until payment
    const redeemAccessCode = (code) => {
        const trimmed = code.trim().toUpperCase();
        const match = ACCESS_CODES[trimmed];
        if (match) {
            localStorage.setItem('vsp_access_code', trimmed);
            setAccessCodeData(match);
            return { success: true, label: match.label };
        }
        return { success: false };
    };

    const clearAccessCode = () => {
        localStorage.removeItem('vsp_access_code');
        setAccessCodeData(null);
    };

    // hasPaidSubscription: reflects actual payment — owner/privileged always pass,
    // otherwise requires Firestore isPaid === true (set by Stripe webhook)
    const hasPaidSubscription = isOwner || isPrivileged || userProfile?.isPaid === true;

    const value = {
        currentUser,
        userProfile,
        savedSignature,
        isPaid: true, // Builder feature flags — always on; Stripe gating post-launch
        hasPaidSubscription,
        tier: (isOwner || isPrivileged) ? "enterprise" : (accessCodeData?.tier || userProfile?.tier || "free"),
        // brandingLocked: true means user has community access but must pay to remove branding
        brandingLocked: !isOwner && !isPrivileged && !!accessCodeData?.brandingLocked,
        accessCodeData,
        redeemAccessCode,
        clearAccessCode,
        subscriptionStatus: userProfile?.subscriptionStatus || null,
        currentPeriodEnd: userProfile?.currentPeriodEnd || null,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
