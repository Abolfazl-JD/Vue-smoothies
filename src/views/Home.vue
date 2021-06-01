<template>
  <Loading v-if="loading"/>
    <div v-else>
      <transition-group v-if="smoothies.length" 
        tag="div" 
        class="home container"
        appear
        @before-enter="beforEnter"
        @enter="enter"
      >
        <div class="card" v-for="(smoothie , index) in smoothies" :key="smoothie.key" :data-index="index">
          <div class="card-content">
            <i class="material-icons delete" @click="deleteIngredient(smoothie.key)">delete</i>
            <h2 class="indigo-text">{{ smoothie.title }}</h2>
            <ul class="ingredients">
              <li v-for="(ingredient, index) of smoothie.ingredients" :key="index">
                <span class="chip">{{ ingredient }}</span>
              </li>
            </ul>
            <router-link :to="{name : 'editSmoothie' , params : {id: smoothie.key}}">
              <span class="btn-floating btn-large halfway-fab pink">
                  <i class="material-icons edit">edit</i>
              </span>
            </router-link>
          </div>
        </div>
      </transition-group>
      <div id="nothing" v-else>Woohoo, no smoothie to drink</div>
    </div>
    
</template>

<script>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import axios from 'axios'
import Loading from '../components/loading'

export default {
  components: {Loading},
  setup(){
    //datas
    const smoothies = ref([])
    const loading = ref(false)

    //functions
    //transition function
    const beforEnter = (el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(100px)"
    }
    //transition function
    const enter = (el, done) => {
      gsap.to(el, {
        opacity : 1,
        y : 0,
        duration : 0.8,
        onComplete : done,
        delay : el.dataset.index * 0.2
      })
    }
    const deleteIngredient = (key) => {
      loading.value = true
      axios.delete("https://smoothies-20627-default-rtdb.firebaseio.com/smoothies/" + key +".json")
      .then(data => smoothies.value = smoothies.value.filter(e => e.key !== key))
      .then(data => loading.value = false)
    }

    //lifecycle hooks
    onMounted(() => {
      loading.value = true
      axios.get("https://smoothies-20627-default-rtdb.firebaseio.com/smoothies.json")
      .then((data) => {
        for (const key in data.data) {
          smoothies.value.push({...data.data[key], key : key})
        }
      })
      .then(data => loading.value = false)
    })

    return {smoothies, beforEnter, enter, loading, deleteIngredient}
  }
}
</script>

<style>
.home{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top: 60px;
}
.home h2{
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.home .ingredients{
  margin: 30px auto;
}
.home .ingredients li{
  display: inline-block;
}
.home .delete{
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
.switch-enter-from,
  .switch-leave-to{
    opacity: 0;
    transform: translateY(20px);
  }
.switch-enter-active,
.switch-leave-active{
    transition: all 0.4s ease;
  }
#nothing{
  margin: 112px auto;
    display: block;
    width: 269px;
    font-size: 18px;
    font-weight: 700;
}
</style>
