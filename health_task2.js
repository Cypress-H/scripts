/*
http:\/\/datav\.njupt\.edu\.cn/feiyan_api/examen/examenAnswerController/commitAnswer.do? url script-request-header health_task2.js

mitm
datav.njupt.edu.cn
*/
var $cypress = cypress();

var date = new Date()

if ($cypress.isRequest) 
{
  GetCookie()
} 
else
{
  checkin()
}

function checkin() 
{
  var bonus = 
  {
    url: 'http://datav.njupt.edu.cn/feiyan_api/examen/examenAnswerController',
    headers: 
    {
      Cookie: $cypress.read("CookieJK"),
    }
  };

  $cypress.get(bonus, function(error, response, data) 
  {
    if (error) 
    {
      console.log(error);
      $cypress.notify("健康打卡", "签到请求失败 ‼️‼️", error)
    } 
    else 
    {
      $cypress.notify("健康打卡", "", date.getMonth() + 1 + "月" + date.getDate() + "日, 签到成功 🎉")
      } 
   })
}

function GetCookie() {
  try {
    if ($request.headers && $request.url.match(/datav\.njupt\.edu\.cn/)) {
      var CookieName = "健康打卡";
      var CookieKey = "CookieJK";
      var CookieValue = $request.headers['Cookie'];
      if ($cypress.read(CookieKey)) {
        if ($cypress.read(CookieKey) != CookieValue) {
          var cookie = $cypress.write(CookieValue, CookieKey);
          if (!cookie) {
            $cypress.notify("", "", "更新" + CookieName + "Cookie失败 ‼️");
          } else {
            $cypress.notify("", "", "更新" + CookieName + "Cookie成功 🎉");
          }
        }
      } else {
        var cookie = $cypress.write(CookieValue, CookieKey);
        if (!cookie) {
          $cypress.notify("", "", "首次写入" + CookieName + "Cookie失败 ‼️");
        } else {
          $cypress.notify("", "", "首次写入" + CookieName + "Cookie成功 🎉");
        }
      }
    } else {
      $cypress.notify("写入Cookie失败", "", "请检查匹配URL或配置内脚本类型 ‼️");
    }
  } catch (eor) {
    $cypress.notify("写入Cookie失败", "", "未知错误 ‼️")
    console.log(JSON.stringify(eor) + "\n" + eor + "\n" + JSON.stringify($request.headers))
  }
  $cypress.done();
}

function cypress() {
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.get(options, (error, response, body) => {
      callback(error, adapterStatus(response), body)
    })
  }
  const done = (value = {}) => {
    if (isQuanX) isRequest ? $done(value) : null
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    isRequest,
    notify,
    write,
    read,
    get,
    done
  }
};
