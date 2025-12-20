from playwright.sync_api import sync_playwright

def verify_gooey_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            # Navigate to the home page first
            page.goto("http://localhost:5173")
            page.wait_for_load_state("networkidle")

            # Click the Gooey button to navigate
            page.get_by_text("GOOEY").click()

            # Wait a bit
            page.wait_for_timeout(2000)

            # Take a screenshot to see what's happening regardless of finding text
            page.screenshot(path="verification/debug_gooey.png")

            print("Took debug screenshot")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_gooey_page()
