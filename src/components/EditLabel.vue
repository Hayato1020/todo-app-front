<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            max-width="450px"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                >
                ラベル追加・削除
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">ラベルの編集</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="form">
                            <v-row>
                                <v-col
                                    cols="6"
                                    sm="6"
                                    md="8"
                                >
                                    <v-text-field
                                        v-model = "newLabel"
                                        label="追加するラベル"
                                        required
                                        :rules="addLabelRules"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-card-actions>
                                        <v-btn
                                            color="primary"
                                            @click="clickSaveLabel()"
                                            v-bind:disabled="activateSubmit()"
                                        >
                                        保存する
                                        </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        
                            <v-row>
                                <v-col
                                    cols="6"
                                    sm="6"
                                    md="8"
                                >
                                    <v-autocomplete
                                    v-model = "deleteLabelId"
                                    :items="labels"
                                    item-value="label_id"
                                    item-text="label"
                                    label="削除するラベル"
                                    clearable
                                    :rules="deleteLabelRules"
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="4">
                                    <v-card-actions>
                                        <v-btn
                                            color="primary"
                                            @click="clickDeleteLabel()"
                                            v-bind:disabled="activateDelete()"
                                        >
                                            削除する
                                        </v-btn>
                                    </v-card-actions>
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
            },
        data: function() {
        return {
            dialog: false,
            newLabel: null,
            deleteLabelId: null,
            menu: false,
            addLabelRules: [
                v => !!v || '追加するにはラベル名を入力して下さい',
            ],
            deleteLabelRules: [
                v => !!v || '削除するにはラベルを選択して下さい',
            ]
        }
        },
        mounted: function(){
            
        },
        
        methods: {
            clickSaveLabel: async function(){
                await axios.post(process.env.VUE_APP_API_URL+"label",{
                    label:this.newLabel
                    },).then(
                        function (postTaskResponse) {
                        console.log(postTaskResponse)
                    }.bind(this))
                        this.newLabel = null
                        this.$refs.form.resetValidation()
                        this.dialog = false
                        this.$emit("getLabel")
                    },

            clickDeleteLabel: async function(){
                await axios.delete(process.env.VUE_APP_API_URL+"label",{
                    data: {
                        label_id:this.deleteLabelId
                    }}).then(
                        function (deleteLabelReponse) {
                            console.log(deleteLabelReponse)
                        }.bind(this)
                    )
                    this.$refs.form.reset() 
                    this.dialog = false
                    this.$emit("getLabel")
                },
            activateSubmit:function(){
                if (this.newLabel == null || this.newLabel == ""){
                    return true
                }
                return false
            },
            activateDelete:function(){
                if (this.deleteLabelId == null || this.deleteLabelId == ""){
                    return true
                }
                return false
            }

        },
    }
</script>
