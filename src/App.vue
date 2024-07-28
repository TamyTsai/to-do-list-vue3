<script setup>
// <script setup>是一種在SFC(Single File Component)中使用的語法糖，在使用這個語法糖時，大多數時候跟使用<setup>沒有太大的差異，但還是有些地方需要注意。
//另外，這邊也簡單提一下用這個語法糖比較大的優點是什麼，主要是 不再需要透過return，才能在template使用 特定的變數或函式(也包含import進來的內容)，也因為如此，能讓程式碼看起來更簡潔

  import { ref, onMounted, computed, watch } from 'vue'
  // ref 處理state
  // 虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 ref attribute
  // ref 是一个特殊的 attribute，和 v-for 章节中提到的 key 类似。它允许我们在一个特定的 DOM 元素 或 子组件实例 被挂载后，获得 对它的直接引用。这可能很有用，比如说在 组件 挂载时 将焦点设置到一个 input 元素上，或在一个元素上 初始化一个第三方库。
  // mouted 首次渲染頁面或元件
  // watch 監視ref中的任何變動

  // 待辦清單 初始設定為空陣列 陣列中裝一個個待辦事項
  const todos = ref([])
  // 使用者名稱
  const name = ref('')

  // 使用者輸入之 待辦事項內容
  const input_content = ref('')
  // 使用者輸入之 待辦事項種類
  const input_category = ref(null)

  // 排序過的 待辦事項陣列（新的放前面）
  const todos_asc = computed(() => todos.value.sort((a, b) => {
    return b.createdAt - a.createdAt
  }))
  // arr.sort([compareFunction])
  // compareFunction 指定一個函式來 定義排序順序。假如省略此參數，陣列將根據各個元素轉為字串後的每一個字元之 Unicode 編碼位置值進行排序。
  // 若 compareFunction(a, b) 的回傳值小於 0，則會把 a 排在小於 b 之索引的位置，即 a 排在 b 前面。
  // b.createdAt - a.createdAt：如果a的建立時間晚於b，則b.createdAt - a.createdAt為負，a就會排在b前面

  //  function 有兩個參數值，分別為改變後的值，及改變前的值。
  watch(name, (newVal) => {
    localStorage.setItem('name', newVal)
  }) // 可由主控台看到本地Storage中name變數的值 隨輸入框內容變化
  // 在 HTML5 問世後，介紹了 Web Storage 的使用 — 可以將網頁中的資料儲存在使用者的瀏覽器當中 — 也就是説可以在（client）客戶端儲存資料。使用上的好處在於大部分瀏覽器都有支援、可以儲存資料的容量大多有 5MB 以上、且資料儲存和提取相對簡單方便。本篇除了介紹如何使用和可能會遇到的問題，也在最後透過一個簡單的網路應用程式 — Wish List — 來實用與操作。
  // localStorage：可以跨瀏覽器分頁做使用、使用者關掉分頁或瀏覽器再打開資料仍不會消失，且資料無期效限制，資料將永久被保留
  // 存入資料：setItem()

  watch(todos, (newVal) => {
    localStorage.setItem('todos', JSON.stringify(newVal))
  }, { deep: true })
  // 可選設定包含 deep、immediate。如果想要加上可選設定，需把 value 改寫為 Object 形式，用以傳入其他值
  // 當欲觀察值的特性為 call by reference，例如 Object 時，需將 deep 值設定為 true，告知 watch 需要 深度觀察。否則會因為特性關係，無法 觸發監聽器。
  // JSON.stringify() ：物件變 JSON。JSON 會儲存純文字，不算是一種 Javascript，但是 Javascipt 有內建的方法可以解析他，其中將任何物件轉變為 JSON 字串的方法，就是 JSON.stringify() ，string 本身就是字串的意思，stringify 則視為動詞字串化，將 Javascript 物件轉為 JSON 字串。

  // 於 待辦清單 加入 待辦事項 的方法（點擊 表單送出按鈕時 觸發）
  const addTodo = () => {
    // 如果使用者 沒輸入 待辦事項內容 或 沒選擇 待辦事項種類
    if (input_content.value.trim() === '' || input_category.value === null) {
      return
    }
    
    // 如果使用者 有輸入 待辦事項內容 並 有選擇 待辦事項種類
    // 對todo key中的值（陣列） 加入陣列元素（物件 content等為key，input_content.value為value）
    todos.value.push({
      content: input_content.value,
      category: input_category.value,
      done: false,
      editable: false,
      createdAt: new Date().getTime()
    })

    // 輸入送出後 輸入框及選擇框清空
    input_content.value = ''
    input_category.value = null
  }

  // 於 待辦清單 移除 待辦事項 的方法（點擊 刪除按鈕時 觸發）（需要傳入 要被刪除的待辦事項 作為參數）
  const removeTodo = (todo) => {
    todos.value = todos.value.filter((t) => t !== todo)
  }
  // filter：JSON陣列根據某個字段的值進行過濾，返回過濾後的集合（後面是要接被留下來的東西，不是要被過濾掉的東西）
  // filter((t) => t !== todo) 把 要被刪除的待辦事項 過濾掉，回傳 不含 該待辦事項 的 待辦清單陣列

  // onMounted：Vue實體 與 掛載完成，el的目標DOM被 $el 所替換（可以視做jQuery的Ready）
  onMounted(() => {
    name.value = localStorage.getItem('name') || '' // 取出資料：getItem() // 取出'name'的資料 存到name key的value中
    todos.value = JSON.parse(localStorage.getItem('todos')) || []
  })
  // 前面雖已將 使用者輸入的 名字 及 待辦清單中的事項 用 setItem() 存入 LocalStorage，但還是要再 getItem取出資料，才能於畫面 顯示 LocalStorage存放的資料

</script>

<template>

    <main class="app">

        <section class="bg-gray-100 max-w-3xl mx-auto p-5 rounded-lg shadow-lg">
          <section class="greeting">
            <h2 class="title">
              <span>你好, </span><input type="text" placeholder="輸入你的名字" v-model="name">
            </h2>
          </section>

          <section class="create-todo">
            <h3 class="text-xl mt-3 mb-2 font-bold">建立待辦事項</h3>

            <!-- 新增待辦事項 表單區 -->
            <form @submit.prevent="addTodo">
            <!-- ＠為v-on簡寫 -->
            <!-- 有一顆按鈕，但是我不希望他就這樣直接submit出去，那怎麼辦？我還是希望他按下按鈕之後會跑出“here I am！”，但是他不要送出資訊轉到submit.html，那這時我們要怎麼做？很簡單，我們只要寫v-on:submit.prevent就好了 -->
              <h4 class="text-gray-500 my-1">今天有什麼待辦事項呢？</h4>
              <input type="text" name="content" id="content" placeholder="例如：寫作業" v-model="input_content">
              <!-- 雙向綁定 input_content 讓此變數的值可以透過輸入輸入框來改變-->

              <h4 class="text-xl mt-3 mb-2 font-bold">選擇分類</h4>

              <div class="options">

                <label>
                  <!-- radio為單選 同一組選項name要一樣 選項間的value要不同 -->
                  <input type="radio" name="category" value="business" v-model="input_category" />
                  <span class="bubble business"></span>
                  <div>工作</div>
                </label>

                <label>
                  <input type="radio" name="category" value="personal" v-model="input_category" />
                  <span class="bubble personal"></span>
                  <div>私人</div>
                </label>

              </div>

              <input type="submit" value="新增待辦"/>
            </form>
          </section>
          
          <!-- 已建立 之 待辦事項清單 區塊 -->
          <section class="todo-list">
            <h3>待辦清單</h3>
            <div class="list">

              <!-- 把 排序過的待辦清單陣列（todos_asc）中 的 待辦事項元素（todo） 透過迴圈轉出來-->
              <div v-for="todo in todos_asc" :class="`todo-item ${todo.done && 'done'}`">
              <!-- todo.done 可取得 待辦事項元素（todo） done屬性所對應的value -->
              <!-- :class="...." 為 v-bind:class="...." 簡寫 -->

                <label>
                  <input type="checkbox" v-model="todo.done" />
                  <!-- 勾選框的值與 todo物件的done屬性之值雙向綁定，當使用者勾選輸入框時，該待辦事項的done值變成true -->
                  <span :class="`bubble ${ todo.category }`"></span>
                </label>

                <div class="todo-content">
                  <input type="text" v-model="todo.content" />
                  <!-- 已建立之待辦事項 內容編輯區域 -->
                  <!-- 雙向綁定 todo物件的content屬性之值，使用者 於 輸入框 更新待辦事項內容時，該待辦事項的content值隨之改變 -->
                </div>

                <div class="actions">
                  <button class="delete" @click="removeTodo(todo)">刪除</button>
                </div>

              </div>

            </div>
          </section>
        </section>

    </main>

</template>
