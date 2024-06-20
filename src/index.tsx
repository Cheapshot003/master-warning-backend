import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { testComponent } from './components/testComponents'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import * as elements from "typed-html"
import { logger } from "@bogeychan/elysia-logger";
import { staticPlugin } from '@elysiajs/static'
import { supabase } from './auth/supabaseClient'

const app = new Elysia()
  .use(html())
  .use(staticPlugin())

  .use(logger({
    level: "error"
    }))
  
  .get("/", async ({ html }: any) => {
  return  html(
      <Layout title="MasterWarning">
      </Layout>
    )
  }
  )
  .get("/test", async ({ html }: any) => {
    return html(
      <Layout>
        <Login />
      </Layout>
    )
  }
  )
  .get("/login", async ({html}: any) => {
    return html(
        <Layout title="MasterWarning - Login">
          <Login />
        </Layout>
      )
  }
    )

  .get("/register", ({html}: any) => 
    html(
      <Layout title="MasterWarning - Register">
        <Register />
      </Layout>
    ))

  .post("/register", async ({ body }: any) => {
    const { data, error } = await supabase.auth.signUp(body);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
    return data.user
  })

  .post("/login", async ({ body }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword(body)

    if (error) return error

    return data.user

  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
