import { supabase } from "./supabaseClient";
import { Elysia, redirect } from "elysia";
import Layout from "../components/Layout";
import Register from "../components/Register";
import { html } from '@elysiajs/html'
import Login from "../components/Login";
import * as elements from "typed-html";
import { auth, deriveUser } from "./authModule";
import Dashboard from "../components/Dashboard";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { User } from "@supabase/supabase-js";

export const appModule = (app: Elysia) => 
    app
        .group("/app", (group) => 
            group
                .get("/dashboard", async ({ html, user}: any) => {
                    console.log(user)
                    if (user == null) return redirect("/auth/sign-in") 
                    return html(
                        <Layout title="MasterWarning - Dashboard" user={user}>
                            <Dashboard user={user as User}/>
                        </Layout>
                    )
                }))