'use client';

import LogoutButton from "@/components/LogoutButton";
import { useAuthStore } from "@/store/useAuthStore";

export default function Dashboard(){
    return (
    <div>Dashboard
        <LogoutButton/>
    </div>
    );
}