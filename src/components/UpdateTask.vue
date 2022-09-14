<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
    
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          編集
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">タスクの編集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="5"
              >
               <v-autocomplete
                  v-model= "newTask.status_id"
                  :items="statuses"
                  item-value="status_id"
                  item-text="status"
                  label="状況"
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="5"
              >
                <v-autocomplete
                  v-model = "newTask.label_id"
                  :items="labels"
                  item-value="label_id"
                  item-text="label"
                  label="ラベル"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                <v-text-field
                  v-model = "newTask.task"
                  label="*タスク名"
                  required
                  :rules="taskRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model = "newTask.taskInfo"
                  label="タスクの説明"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >    <v-row class="justify-start">
                タスクの期限
              </v-row>
 
                <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="newTask.deadlineOfTask"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="newTask.deadlineOfTask"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="newTask.deadlineOfTask"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                          >
                            取り消し
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(newTask.deadlineOfTask)"
                          >
                            保存
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
              </v-col>
              <v-col
                v-model = "newTask.priorityOfTask"
                cols="12"
                sm="10"
                md="5"
              >優先度
                <v-rating
                    v-model="newTask.priorityOfTask"
                    background-color=#F57C00
                    color=#F57C00
                    large
                ></v-rating>
              </v-col>

            </v-row>
          </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            閉じる
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="clickSave()"
            v-bind:disabled="activateSubmit()"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
  export default {
    props:{
        labels:null,
        statuses:null,
        task:null
        },
    data: function() {
      return {
        dialog: false,
        newTask:{
            status_id:null,
            label_id:null,
            task:null,
            taskInfo:null,
            deadlineOfTask:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            priorityOfTask:null,
        },
        taskRules: [
          v => !!v || '入力が必須の項目です',
        ],
        menu: false,
      }
    },
    mounted: function(){
        this.newTask.task = this.task.task
        this.newTask.taskInfo = this.task.task_info
        this.newTask.priorityOfTask = this.task.priority_of_task
        this.newTask.deadlineOfTask = this.task.deadline_of_task
        this.newTask.status_id = String(this.task.status_id)//Stringに変換しないとv-autocompleteがkeyとして認識できない
        this.newTask.label_id = this.task.label_id
    },
    //ソートした際にコンポーネントの更新を行う
    watch:{
      'task.task_id':function(){
        this.newTask.task = this.task.task
        this.newTask.taskInfo = this.task.task_info
        this.newTask.priorityOfTask = this.task.priority_of_task
        this.newTask.deadlineOfTask = this.task.deadline_of_task
        this.newTask.status_id = String(this.task.status_id)//Stringに変換しないとv-autocompleteがkeyとして認識できない
        this.newTask.label_id = this.task.label_id
      }
    },
    
    methods: {
        clickSave: async function(){
          await axios.put(process.env.VUE_APP_API_URL+"task",{
              task_id:this.task.task_id,
              task:this.newTask.task,
              task_info:this.newTask.taskInfo,
              deadline_of_task:this.newTask.deadlineOfTask,
              priority_of_task:this.newTask.priorityOfTask,
              status_id:Number(this.newTask.status_id),
              label_id:this.newTask.label_id
            },{
              headers:{
                access_token:this.$_accessToken()
              }
            }).then(
            function (putTaskResponse) {
              console.log(putTaskResponse)
            }.bind(this)
            )
            this.$refs.form.resetValidation()
            this.dialog = false
            //コールバック関数の呼び出し（親コンポーネントのメソッドの実行）
            this.$emit("getTask")
        },
        activateSubmit:function(){
          if (this.newTask.task == null || this.newTask.task == ""){
            return true
          }
          return false
        },        
        clickTest: function(){
          console.log(this.task)
        }
    },
  }
</script>
