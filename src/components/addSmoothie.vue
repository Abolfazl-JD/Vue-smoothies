<template>
  <Loading v-if="loading"/>
  <div class="add-smoothie container z-depth-1" v-else>
    <h2 class="center-align indigo-text">Add New Smoothie Recipe</h2>
    <form>
      <div class="field title">
        <label id="title" for="title">Smoothie title:</label>
        <input type="text" name="title" v-model="title">
      </div>
      <div v-for="(ingredient, index) in ingredients" class="field ingredient" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="ingredients[index]">
        <i class="material-icons delete" @click="deleteIng(ingredient)">delete</i>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient (press + to add):</label>
        <i class="material-icons add-icon" @click="addIngredient">add</i>
        <input id="form" type="text" name="add-ingredient" v-model="ing" @focus="focus">
      </div>
      <div class="field center-align">
        <transition-group name="toast">
          <p v-if="feedback" class="red-text" key="1">{{ feedback }}</p>
          <div key="2">
            <button class="btn pink"  @click.prevent="addSmoothie">Add Smoothie</button>
            <button class="btn cancel" @click="$router.push({name : 'home'})">cancel</button>
          </div>
        </transition-group>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import router from "@/router"
import Loading from '../components/loading'

export default {
  components : {Loading},
  setup(){
    //datas
    const title = ref(null)
    const ing = ref(null)
    const ingredients = ref([])
    const feedback = ref(null)
    const loading = ref(false)

    //functions
    const focus = () => {
      document.querySelector(".add-icon").style.color = "#000"
    }
    const addIngredient = () => {
      if(ing.value){
        ingredients.value.push(ing.value)
        ing.value = ""
        document.getElementById("form").focus()
      }
      else{
        feedback.value = "you must enter an ingredient"
        setTimeout(() => feedback.value = null, 3000)
      }
    }
    const deleteIng = (ing) => {
      ingredients.value = ingredients.value.filter(e => e!==ing)
    }
    const addSmoothie = () => {
      if(title.value){
          loading.value = true
          ing.value ? ingredients.value.push(ing.value) : null
          axios.post("https://smoothies-20627-default-rtdb.firebaseio.com/smoothies.json" , {
          ingredients : ingredients.value,
          title: title.value
        })
        .then(data => router.back())
        .then(data => loading.value = false)
      }
      else {
        feedback.value = "you must enter a title"
        setTimeout(() => feedback.value = null, 3000)
      }
    }

    return {title, ing , focus, addIngredient, deleteIng, feedback , ingredients, addSmoothie, loading}
  }
  
}
</script>

<style>
.add-smoothie{
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.add-smoothie h2{
  font-size: 2em;
  margin: 20px auto;
}
.add-smoothie .field{
  margin: 20px auto;
  position: relative;
}
.add-smoothie .delete{
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4em;
  cursor: pointer;
}
.cancel{
    color: #e91e63;
    border: 2px solid #e91e63;
    border-radius: 5px;
    margin-left: 33px;
    line-height: 0px;
    padding: 0 22px;
    background: #fff;
    transition: 0.3s all ease;
}
.cancel:hover{
  background: #e91e63;
  color: #fff;
}
.add-icon{
  position: absolute;
  right: 5px;
  top: 36px;
  color: #9e9e9e;
  cursor: pointer;
}
.toast-enter-active{
  animation: wobble 0.5s ease;
}
 .toast-leave-from{
  opacity: 1;
  transform: translateY(0);
  
} 
.toast-leave-to{
  opacity: 0;
  transform: translateY(-60px);
}

.toast-leave-active{
  transition: all 0.3s ease;
}

@keyframes wobble{
  0%{opacity : 0 ; transform: translateY(-60px);}
  50%{opacity : 1 ; transform: translateY(0)}
  60%{transform: translateX(8px);}
  70%{transform: translateX(-8px);}
  80%{transform: translateX(4px);}
  90%{transform: translateX(-4px);}
  100%{transform: translateX(0);}
}
.toast-move{
  transition: all 0.3s ease;
}
</style>