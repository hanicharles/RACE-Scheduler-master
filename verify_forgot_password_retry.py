import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        print("Navigating to Login page...")
        await page.goto("http://localhost:3000/login")

        # Verify Forgot Password link exists and click it
        print("Clicking Forgot Password link...")
        await page.click("text=Forgot Password?")

        # Should be on /forgot-password
        await page.wait_for_url("**/forgot-password")
        print("On Forgot Password page.")

        # Take screenshot 1
        os.makedirs("verification", exist_ok=True)
        await page.screenshot(path="verification/forgot_password_page.png")
        print("Screenshot 1 saved.")

        # Simulate Reset Password flow (direct navigation as we can't easily get the email token here without backend hooks,
        # but we can check the UI by navigating to the route with a fake token)
        # The route is /reset-password?token=...

        print("Navigating to Reset Password page...")
        await page.goto("http://localhost:3000/reset-password?token=fake-token")

        # Take screenshot 2
        await page.screenshot(path="verification/reset_password_page.png")
        print("Screenshot 2 saved.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
