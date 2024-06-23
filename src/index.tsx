import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { testComponent } from './components/testComponents'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from "./components/Dashboard";
import * as elements from "typed-html"
import { logger } from "@bogeychan/elysia-logger";
import { staticPlugin } from '@elysiajs/static'
import { supabase } from './auth/supabaseClient'
import { auth, deriveUser } from "./auth/authModule";
import { asHookType } from "elysia/utils";
import { appModule } from "./auth/dashboardModule";

const app = new Elysia()
  .use(html())
  .use(staticPlugin())

  .use(logger({
    level: "trace"
    }))
  .derive(deriveUser)
  .use(auth)
  .use(appModule)
  .get("/", async ({ html, user }: any) => {
  return  html(
      <Layout title="Test" user={user}>
      </Layout>
    )
  }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
