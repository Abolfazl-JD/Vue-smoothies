<template>
    <Loading v-if="loading"/>
    <div v-if="smoothie && !loading" class="edit-smoothie container z-depth-1">
        <h2 class="indigo-text center-align">Edit {{ smoothie.title }} Smoothie</h2>
        <form>
        <div class="field title">
            <label for="title">Smoothie title:</label>
            <input type="text" name="title" v-model="smoothie.title">
        </div>
        <div v-for="(ingredient, index) in smoothie.ingredients" class="field ingredient" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="smoothie.ingredients[index]">
        <i class="material-icons delete" @click="deleteIngredient(ingredient)">delete</i>
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
              <button class="btn pink"  @click.prevent="editSmoothie">Edit Smoothie</button>
              <button class="btn cancel" @click="$router.push({name : 'home'})">cancel</button>
            </div>
            </transition-group>
        </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import  axios from 'axios'
import router from '@/router'
import Loading from '../components/loading'

export default {
    components : {Loading},
    props : ['id'],
    setup(props){
        //datas
        const smoothie = ref(null)
        const feedback = ref(null)
        const ing = ref(null)
        const loading = ref(false)

        //functions
        const focus = () => {
            document.querySelector(".add-icon").style.color = "#000"
        }
        const deleteIngredient = (ingredient) => {
            smoothie.value.ingredients = smoothie.value.ingredients.filter(e => e !== ingredient)
        }
        const addIngredient = () => {
            if(ing.value){
                smoothie.value.ingredients.push(ing.value)
                ing.value = ""
                document.getElementById("form").focus()
            }
            else{
                feedback.value = "you must enter an ingredient"
                setTimeout(() => feedback.value = null, 3000)
            }
        }
        const editSmoothie = () => {
            if(smoothie.value.title){
                loading.value = true
                ing.value ? smoothie.value.ingredients.push(ing.value) : null
                axios.put("https://smoothies-20627-default-rtdb.firebaseio.com/smoothies/" + props.id +".json", smoothie.value)
                .then(data => router.back())
                .then(data => loading.value = false)
            }
            else {
                feedback.value = "you must enter a title"
                setTimeout(() => feedback.value = null, 3000)
            }
        }

        //lifecycle hooks
        onMounted(() => {
            loading.value = true
            axios.get("https://smoothies-20627-default-rtdb.firebaseio.com/smoothies/" + props.id +".json")
            .then(data =>  data.data)
            .then(data => smoothie.value = data)
            .then(data => loading.value = false)
        })

        return {smoothie, feedback, ing, editSmoothie, focus, deleteIngredient, addIngredient, loading}
    }
}
</script>

<style>
.edit-smoothie{
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
  margin-bottom: 94px;
}
.edit-smoothie h2{
  font-size: 2em;
  margin: 20px auto;
}
.edit-smoothie .field{
  margin: 20px auto;
  position: relative;
}
.edit-smoothie .delete{
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