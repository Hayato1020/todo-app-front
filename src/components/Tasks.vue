<template>
<v-app id="app">
  <div class="task" v-if="tasks.taskObject">
    <v-container>
      <v-row>
        <v-col cols="2">
          <AddTask 
            :labels="labels.labelObject.label_list" 
            :statuses="statuses.statusObject.statuses_list"
            :tasks.sync="tasks.taskObject.task_list"
            v-on:getTask="getTask"
          />
        </v-col>
        <v-col cols="2">
           <EditLabel 
            :labels="labels.labelObject.label_list"
            v-on:getLabel="getLabel"  
          />
        </v-col>
      </v-row>
      <p></p>
      <v-row>
          <v-card>
            <v-row>
              <v-col cols="3">
                <v-card-title>
                <v-select
                  label="状況"
                  item-text="status"
                  item-value="status_id"
                  :items="statuses.statusObject.statuses_list"
                  v-model="filteredStatusId"
                  clearable
                >
                </v-select>
                </v-card-title>
              </v-col>
               <v-col cols="3">
                <v-card-title>
                <v-select
                  label="ラベル"
                  item-text="label"
                  item-value="label_id"
                  :items="labels.labelObject.label_list"
                  v-model="filteredLabelId"
                  clearable
                ></v-select>
                </v-card-title>
              </v-col>
              <v-col cols="6">
                <v-card-title>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="タスク名・タスク説明で検索"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
              </v-col>
            </v-row>
          <v-data-table 
            :headers="headers" 
            :items="tasks.taskObject.task_list"
            :search="search"
            >
            <template 
              v-slot:[`item.status_id`]="{ item }"
            >
               {{ StatusIdToStatus(item.status_id) }}
            </template>
            <template 
              v-slot:[`item.label_id`]="{ item }"
            >
               {{ LabelIdToLabel(item.label_id) }}
            </template>
          <!--itemはタスク1つを表す-->
          <template v-slot:[`item.priority_of_task`]="{ item }" >
            <PriorityOfTask 
              :rating="item.priority_of_task"
            />
          </template>
          <template v-slot:[`item.update`]="{ item }"> 
            <UpdateTask 
              :labels="labels.labelObject.label_list" 
              :statuses="statuses.statusObject.statuses_list"
              :task = "item"
              v-on:getTask="getTask"
            />
          </template>
           <template v-slot:[`item.delete`]="{ item }">
          <v-btn
            color=#FF8A80
            @click="deleteItem(item)"
          >
            削除
          </v-btn>
        </template>
          </v-data-table>
          </v-card>
       
      </v-row>
    </v-container>
    <p>{{ tasks.task_list }}</p>
    <ul></ul>
  </div>
  </v-app>
</template>

<script>
import axios from "axios";
import AddTask from "./AddTask.vue";
import UpdateTask from "./UpdateTask.vue";
import EditLabel from "./EditLabel.vue";
import PriorityOfTask from "./PriorityOfTask.vue";
import router from "@/router";
export default {
    components: {
    AddTask,
    UpdateTask,
    EditLabel,
    PriorityOfTask
},
  name: "TaskGet",
  data: function () {
    //tasks: null;
    return {
      filteredStatusId:"",
      filteredLabelId:"",
      search:"",
      headers: [
        {
          text:"状況",
          value:"status_id",
          filter:this.statusFilter,
          sortable:false,
          
        },
        {
          text:"ラベル",
          value:"label_id",
          sortable:false,
          filter:this.labelFilter,
        },
        {
          text: "タスク",
          value: "task",
        },
        {
          text: "タスクの説明",
          value: "task_info",
        },
        {
          text: "期限",
          value: "deadline_of_task",
          filterable: false,
        },
        {
          text:"優先順位",
          value:"priority_of_task",
          sortable:true,
          filterable: false,
        },
        {
          text:"編集",
          value:'update',
          sortable:false,
          filterable: false,
        }
        ,
        {
          text:'削除',
          value:'delete',
          sortable:false,
          filterable: false,
        },
      ],
      filters: {
        
      },
      tasks: {},
      statuses: {},
      labels: {}
    };
  },
  //axiosによるデータ取得処理
  mounted: async function () {
    //トークンが無い場合は/loginへリダイレクト
    if(this.$_accessToken()==''){
      router.push("/login")
      return
    }
    axios.defaults.headers.common['Authorization'] = this.$_accessToken();
    await axios.get(process.env.VUE_APP_API_URL+"status").then(
      function (getStatusResponse) {
        this.$set(this.statuses, "statusObject", getStatusResponse.data);
        console.log(getStatusResponse);
      }.bind(this)
    );
    this.getLabel()
    this.getTask()
    

  },
  methods: {
    getLabel(){
      axios.get(process.env.VUE_APP_API_URL+"label",).then(
      function (getLabelResponse) {
        this.$set(this.labels, "labelObject", getLabelResponse.data);
        console.log(getLabelResponse);
        
      }.bind(this))
    },
    
    getTask(){
      axios.get(process.env.VUE_APP_API_URL+"task",).then(
        function (getTaskResponse) {
          //デバッグ用にconsoleに出力
          //this.tasks = get_task_response.data;
          this.$set(this.tasks, "taskObject", getTaskResponse.data);
          console.log(getTaskResponse);
          console.log(this.tasks)
        }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    },

    deleteItem (item) {
    //削除ボタンをクリックした行の特定
    //indexは何番目のタスクかを表す
    //itemはクリックされたタスク1つを表す
    const index = this.tasks.taskObject.task_list.indexOf(item);
    
    //削除の実行
    confirm('「'+item.task+'」を削除しますか') && 
    axios.delete(process.env.VUE_APP_API_URL+"task",{
      headers: {},
      data: {
      task_id:item.task_id
    }}).then(
      function (deleteTaskReponse) {
        console.log(deleteTaskReponse)
      }.bind(this)
      ) &&
      this.tasks.taskObject.task_list.splice(index, 1);
    },
    LabelIdToLabel: function(labelId){
      try{
        var index = this.labels.labelObject.label_list.findIndex(e => e.label_id == labelId)
      }catch(e){
        return ""
      }
      if (index !== -1) {
        return this.labels.labelObject.label_list[index].label
      }else{
        return ""
      }  
    },
    StatusIdToStatus: function(statusId){
      try{
        var index = this.statuses.statusObject.statuses_list.findIndex(e => e.status_id == statusId)
      }catch(e){
        return ""
      }
      if (index !== -1) {
        return this.statuses.statusObject.statuses_list[index].status
      }else{
        return ""
      }  
    },
    statusFilter: function(value){
      if(!this.filteredStatusId){
        return true
      }
      return value == this.filteredStatusId
    },
    labelFilter: function(value){
      if(!this.filteredLabelId){
        return true
      }
      return value == this.filteredLabelId
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
