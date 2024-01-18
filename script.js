'use strict'

const routes = [
  { route: "タクシー", time: { taxi: 74}, cost: 15720},
  { route: "ミュースカイ＋名古屋＋地下鉄", time: { kintetsu: 29, transit: 7, subway: 5, walk: 6 }, cost: 1460 },
  { route: "ミュースカイ＋金山＋バス", time: { kintetsu: 24, transit: 17, bus: 24, walk: 3 }, cost: 1400 },
  { route: "ミュースカイ＋金山＋地下鉄", time: { kintetsu: 24, transit: 6, subway: 8, walk: 6 }, cost: 1400 },
  { route: "ミュースカイ＋神宮前＋バス", time: { kintetsu: 21, transit: 10, bus: 30, walk: 3 }, cost: 1330 },
  { route: "ミュースカイ＋金山＋地下鉄", time: { kintetsu: 32, transit: 5, subway: 8, walk: 6 }, cost: 1030 },
]

const trafficType = [
  {type:"kintetsu", display:"ミュースカイ"}, 
  {type:"subway", display:"地下鉄"}, 
  {type:"bus", display:"バス"},
  {type:"taxi", display:"タクシー"}
]

function sortAscRoutes(a, b){
    return a.cost - b.cost 
}

function sortDescRoutes(a, b){
    return b.cost - a.cost  
}

function getSortedByCost(sortCallBack){
  return function routesSort(routes){
    routes.sort(sortCallBack)
    return routes
  }
}

const getSortedByCostAsc = getSortedByCost(sortAscRoutes)
const getSortedByCostDesc = getSortedByCost(sortDescRoutes)

function appendHtmlItem(parentItem, tag , className, textContent){
  const appendItem = document.createElement(tag)
  appendItem.classList.add(className)
  appendItem.textContent = textContent
  parentItem.appendChild(appendItem)
  return appendItem
}

function appendInputItem(parentItem, type){
  
  //要素作成
  const appendItem = document.createElement("input")
  
  //属性設定
  appendItem.value = type 
  appendItem.name = "trafficType"
  appendItem.type = "checkbox"
  
  //要素追加
  parentItem.appendChild(appendItem)
  return appendItem
}

function appendLabelItem(parentItem, display){
  const appendItem = document.createElement("label")
  appendItem.textContent = display
  parentItem.appendChild(appendItem)
}

function appendItemSet(routes){
  const routesDisplayItem = document.querySelector(".routesDisplay")
  for(const route of routes){
    const appendItem = appendHtmlItem(routesDisplayItem, "div", "routeBox")
    appendHtmlItem(appendItem, "p" , "route", route.route)
    appendHtmlItem(appendItem, "p" , "cost", route.cost)
    appendHtmlItem(appendItem, "p" , "duration", getDuration(route.time))
  }
}

function getDuration(routeTime){
  let duration = 0
  for(const key in routeTime){
    duration += routeTime[key]  
  }
  return duration
}

function removeItem(){
  const routesDisplayItems = document.querySelectorAll(".routeBox")
  for(const routesDisplayItem of routesDisplayItems){
    routesDisplayItem.remove()
  }
}

function colorBackgroundEveryOther(selector){
  document.querySelectorAll(selector).forEach(function(htmlItem,idx){
    idx % 2 === 1 && (htmlItem.style.background = "#AAA")
  })
}


document.addEventListener("DOMContentLoaded", function(){
  //***** 交通手段選択 *****
  const selectArea = document.querySelector(".selectTrafficType")
  trafficType.forEach(function(v){
    appendInputItem(selectArea, v.type)
    appendLabelItem(selectArea, v.display)
  })

  const selectTraffic = document.querySelectorAll("input[name='trafficType']")
  const ascDescItem = document.querySelector("select[name='asc_desc']")

  //***** 初期結果表示 *****
  getSortedByCostAsc(routes)
  appendItemSet(routes)
  colorBackgroundEveryOther(".routeBox")

  //***** 条件絞り込み *****
  selectTraffic.forEach(function(v){
    v.addEventListener("change",function(){
      refresh()
    })
  })

  //***** 昇順降順切り替え *****
  ascDescItem.addEventListener("change",function(){
    refresh()
  })

  function refresh(){
    const checkedRoutes = getCheckRoutes()
    if(ascDescItem.value === "asc"){
      getSortedByCostAsc(checkedRoutes)
    }else{
      getSortedByCostDesc(checkedRoutes)
    }
    removeItem()
    appendItemSet(checkedRoutes)
    colorBackgroundEveryOther(".routeBox")
  }

  function getCheckRoutes(){
    const checkedTraffic = Array.prototype.filter.call(
      selectTraffic, v => v.checked
    ).map(
      v => v.value
    )

    if(checkedTraffic.length === 0){
      return JSON.parse(JSON.stringify(routes))
    }

    return routes.filter((v) => {
        return checkedTraffic.some(v2 => v.time.hasOwnProperty(v2))
    })
  }
})

