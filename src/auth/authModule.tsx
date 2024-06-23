import { supabase } from "./supabaseClient";
import { Elysia, redirect, t } from "elysia";
import Layout from "../components/Layout";
import Register from "../components/Register";
import { html } from '@elysiajs/html'
import Login from "../components/Login";
import * as elements from "typed-html";
import { SignInWithPasswordCredentials, SignInWithPasswordlessCredentials } from "@supabase/supabase-js";
import cookie from "@elysiajs/cookie";

export const deriveUser = async ({ cookie: {refresh_token, access_token}}: any) => {
    console.log("XD")                    
    const { data, error } = await supabase.auth.getUser(
                            access_token.value 
                        )

                        if (data.user) {
                            return { user: data.user }
                        }


                        const { data: refreshed, error: refreshError} = 
                            await supabase.auth.refreshSession({
                                refresh_token: refresh_token.value
                            })

                        if (refreshError) return {
                            user: null
                        }

                        return {
                            user: refreshed.user!
                        }
                    }

export const auth = (app: Elysia) =>
    app
        .group("/auth", (group) => 
            group
                .get("/sign-in", async ({html, user}: any) => {
                    if (user) return redirect("/app/dashboard")
                    return html(
                        <Layout title="MasterWarning - Login" user={user}>
                        <Login />
                        </Layout>
                    )})
                .get("/sign-up", ({html, user}: any) => {
                    return html(
                    <Layout title="MasterWarning - Register" user={user}>
                        <Register />
                    </Layout>
                    )})
                .post("/sign-up", async ({ body }: any) => {
                    const { data, error } = await supabase.auth.signUp(body);
                    if (error) return { error: error.message };
                    return redirect("/auth/sign-in", 301);
                })
                .post("/sign-in", async ({ body, cookie: {refresh_token, access_token}} ) => {
                    const { data, error } = await supabase.auth.signInWithPassword(body as SignInWithPasswordCredentials);
                    if (error) return { error: error.message };
                    refresh_token.value = data.session.refresh_token
                    access_token.value = data.session.refresh_token


                    return redirect("/app/dashboard", 301);
                })
                .get("/logout", async ({ cookie: {refresh_token, access_token} }) => {
                    await supabase.auth.signOut()
                    refresh_token.remove()
                    access_token.remove()
                    return redirect("/")
                })
        )
