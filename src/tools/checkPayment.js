import { Browser, Builder, By, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome"

const checkPayment = async () => {
  // let options = new chrome.Options()
  // options.addArguments('headless') // Chạy Chrome ở chế độ headless
  // options.addArguments('disable-gpu') // Vô hiệu hóa GPU
  // options.addArguments('no-sandbox') // Tùy chọn cho môi trường không sandbox
  // khởi tạo driver
  let driver = await new Builder().forBrowser(Browser.CHROME).build()
  try {
    // lấy đường dẫn của trang web
    await driver.get("https://ebank.tpb.vn/retail/vX/")
    await driver.manage().setTimeouts({ implicit: 500 })
    // lấy phẩn tử theo name; sendkeys để tự động điền
    const username = await driver
      .findElement(By.css('input[placeholder="Tên đăng nhập"]'))
      .sendKeys("0923326858")
    const password = await driver
      .findElement(By.css('input[placeholder="Mật khẩu"]'))
      .sendKeys("Thuhuyen1")
    const btnLogin = await driver.findElement(By.className("btn-login"))
    await btnLogin.click()
  } catch (error) {
    console.log("error", error.toString())
    return false
  } finally {
    await driver.quit()
  }
}

export default checkPayment
