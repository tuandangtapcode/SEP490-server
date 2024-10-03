import { Browser, Builder, By, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome"

const checkPayment = async () => {
  // let options = new chrome.Options()
  // options.addArguments('headless') // Chạy Chrome ở chế độ headless
  // options.addArguments('disable-gpu') // Vô hiệu hóa GPU
  // options.addArguments('no-sandbox') // Tùy chọn cho môi trường không sandbox
  // khởi tạo driver
  const driver = await new Builder().forBrowser(Browser.CHROME).build()
  try {
    // lấy đường dẫn của trang web
    await driver.get("https://tuanpm.drswtfccy4qy1.amplifyapp.com/dang-nhap/")
    await driver.manage().setTimeouts({ implicit: 500 })
    // lấy phẩn tử theo name; sendkeys để tự động điền
    const username = await driver
      .findElement(By.css('input[placeholder="Email"]'))
      .sendKeys("tuanpham081102@gmail.com")
    const password = await driver
      .findElement(By.css('input[placeholder="Mật khẩu"]'))
      .sendKeys("Ab12345")
    const btnLogin = await driver.findElement(By.id("login"))
    await btnLogin.click()
  } catch (error: any) {
    console.log("error", error.toString())
  } finally {
    // await driver.quit()
  }
}

export default checkPayment
