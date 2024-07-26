<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  // ref 處理state
  // mouted 首次渲染頁面或元件
  // watch 監視ref中的任何變動

  const todos = ref([])
  const name = ref('')

  const input_content = ref('')
  const input_category = ref(null)

  const todos_asc = computed(() => todos.value.sort((a, b) => {
    return b.createdAt - a.createdAt
  }))
  // 排序過的待辦事項陣列（新的放前面）

  watch(name, (newVal) => {
    localStorage.setItem('name', newVal)
  }) // 可由主控台看到本地Storage中name變數的值 隨輸入框內容變化

  watch(todos, (newVal) => {
    localStorage.setItem('todos', JSON.stringify(newVal))
  }, { deep: true })

  const addTodo = () => {
    if (input_content.value.trim() === '' || input_category.value === null) {
      return
    }

    todos.value.push({
      content: input_content.value,
      category: input_category.value,
      done: false,
      editable: false,
      createdAt: new Date().getTime()
    })

    input_content.value = ''
    input_category.value = null
    // 輸入送出後 輸入框清空
  }

  const removeTodo = (todo) => {
    todos.value = todos.value.filter((t) => t !== todo)
  }

  onMounted(() => {
    name.value = localStorage.getItem('name') || ''
    todos.value = JSON.parse(localStorage.getItem('todos')) || []
  })
</script>

<template>

  <main class="app">

    <section class="greeting">
      <h2 class="title">
        What's up, <input type="text" placeholder="輸入你的名字" v-model="name">
      </h2>
    </section>

    <section class="create-todo">
      <h3>建立待辦事項</h3>

      <form @submit.prevent="addTodo">
        <h4>你有什麼待辦事項呢？</h4>
        <input type="text" name="content" id="content" placeholder="例如：寫作業" v-model="input_content">
        <!-- 雙向綁定 input_content 讓此變數的值可以透過輸入輸入框來改變-->

        <h4>選擇分類</h4>

        <div class="options">

          <label>
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

        <input type="submit" value="新增待辦" />
      </form>
    </section>
    
    <section class="todo-list">
      <h3>待辦清單</h3>
      <div class="list">

        <div v-for="todo in todos_asc" :class="`todo-item ${todo.done && 'done'}`">

          <label>
            <input type="checkbox" v-model="todo.done" />
            <span :class="`bubble ${ todo.category }`"></span>
          </label>

          <div class="todo-content">
            <input type="text" v-model="todo.content" />
          </div>

          <div class="actions">
            <button class="delete" @click="removeTodo(todo)">刪除</button>
          </div>

        </div>

      </div>
    </section>
  </main>

</template>
