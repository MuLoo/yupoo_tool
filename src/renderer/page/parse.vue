<!--
 * @Author: your name
 * @Date: 2021-06-21 16:44:18
 * @LastEditTime: 2021-06-23 14:35:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /upyun-tool/src/renderer/page/parse.vue
-->
<template>
  <div>
    <a-spin :spinning="spinning">
      <a-tabs default-active-key="1" v-model="activeTab">
      <a-tab-pane key="1" tab="链接解析">
        <keep-alive>
          <section class="section">
            <h3>通过链接解析用户名</h3>
            <div class="part">
                <h4>输入待解析链接</h4>
                <a-textarea v-model="text" placeholder="待解析的yupoo链接" :rows="6" />
                <div class="buttonArea">
                  <a-button type="primary" :disabled="!text.length" @click="startParse">解析</a-button>
                  <a-button @click="() => { this.text = '';this.init() }">重置</a-button>
              </div>
               
                <article v-if="urls.length">
                  <header>共{{urls.length}}条URL</header>
                  <section class="urlTag">
                    <a-tag v-for="(item,index) in urls" :color="randomColor(index)" :key="index">{{item}}</a-tag>
                  </section>
                </article>
            </div>
            <div class="part" v-if="names.length">
              <h4>已解析用户名,共{{names.split(' ').length}}项</h4>
              <a-textarea v-model="names" placeholder="已解析用户名" :rows="6" />
              <a-button class="actionButton" type="primary" :disabled="!names.length" @click="copy('name')">复制</a-button>
            </div>
            <div class="part" v-if="errors.length">
              <h4 style="color:#eb2f96; font-size: 500"><a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#eb2f96" style="margin-right:5px;"/>解析失败链接</h4>
              <a-textarea style="border: 1px solid #ffa39e;" v-model="errors" placeholder="解析失败链接" :rows="8" />
              <a-button class="actionButton" type="primary" :disabled="!errors.length" @click="copy('error')">复制</a-button>
            </div>
          </section>
        </keep-alive>
      </a-tab-pane>
      <a-tab-pane key="2" tab="文件解析" force-render>
        <keep-alive>
          <section class="section">
            <div>
              <a-upload-dragger
                name="file"
                :multiple="false"
                :showUploadList="false"
                :beforeUpload="handleChange"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  点击加载XLSX文件
                </p>
                <p class="ant-upload-hint">
                  解析XLSX文件里所需信息
                </p>
              </a-upload-dragger>
            </div>
            <a-modal
              title="解析结果"
              :visible="showSheetsModal"
              width="700px"
              @ok="handleModalOk"
              @cancel="handleModalCancel"
            >
              <div>
                <h4>解析到以下表格，请选择一项提取信息</h4>
                <a-radio-group name="radioGroup" v-model="sheetRadio" :default-value="null">
                  <a-radio v-for="(item, index) in parseResult" :key="index" :value="index">
                    {{item.sheetName}}
                  </a-radio>
                </a-radio-group>
                <div class="firstLine" v-if="firstLine">
                  <a-radio-group v-model="selectColumn">
                    <a-radio-button v-for="(value, key) in firstLine" :key="key" :value="key" style="margin: 5px">
                      {{key}}:{{value}}
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </div>
            </a-modal>
            <div class="part" v-if="targetColumnData.length">
              <h4>已解析数据, 共{{targetColumnData.split('\n').length}}项</h4>
              <a-textarea v-if="targetColumnData.length" v-model="targetColumnData" placeholder="解析数据列" :rows="10" />
              <div class="buttonArea">
                <a-button type="primary" v-if="targetColumnData.length" @click="copy('parse')">复制</a-button>
                <a-button type="primary" v-if="targetColumnData.length" @click="handleToParse">解析</a-button>
              </div>
            </div>
          </section>
        </keep-alive>
      </a-tab-pane>
    </a-tabs>
    </a-spin>
  </div>
</template>
<script>
import XLSX from 'xlsx'
const { clipboard } = require('electron')
const path = require('path')
export default {
  name: 'parsePage',
  watch: {
    sheetRadio (newVal, oldVal) {
      console.log('newVal ---', newVal)
      if (newVal !== null) {
        // 展示sheet中第一行的信息，选择要获取的东西
        this.firstLine = this.parseResult[Number(newVal)].sheet[0]
      }
    }
  },
  data () {
    return {
      spinning: false,
      text: '',
      names: '',
      errors: '',
      urls: [],
      showSheetsModal: false, // 表格解析出来的数据
      parseResult: [],
      sheetRadio: null,
      firstLine: [],
      selectColumn: '',
      targetColumnData: '',
      activeTab: '1'
    }
  },
  methods: {
    startParse () {
      if (!this.text.length) { return this.$notification['warn']({message: '请输入内容'}) }
      this.spinning = true
      this.init()
      const arr = this.text.trim().split(/\s|\n|,|，|。/).filter(e => e.length) // 分割成数组
      const reg1 = /(?:https?:\/\/)?([\w|-]+)(?=\.x\.yupoo\.com)/ // 匹配 name.x.yupoo.com 类型的url
      const reg2 = /(?:https?:\/\/)?(?:x\.yupoo\.com\/photos\/)([\w|-]+)\// // 匹配 x.yupoo.com/photos/name 类型的url
      this.urls = arr
      const errors = []
      const names = arr.reduce((acc, cur) => {
        if (reg1.test(cur)) {
          const m1 = reg1.exec(cur)
          acc.push(m1[1])
        } else if (reg2.test(cur)) {
          const m2 = reg2.exec(cur)
          acc.push(m2[1])
        } else {
          errors.push(cur)
        }
        return acc
      }, [])
      this.names = Array.from(new Set(names)).join(' ')
      this.errors = Array.from(new Set(errors)).join('\n')
      this.spinning = false
    },
    copy (type) {
      const mapping = {
        name: this.names,
        error: this.errors,
        parse: this.targetColumnData
      }
      clipboard.writeText(mapping[type])
      this.$message.success('已复制')
    },
    randomColor (index) {
      const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']
      return colors[index % 7]
    },
    handleChange (file, fileList) {
      this.spinning = true
      const types = path.extname(file.name)
      const fileType = ['.xlsx', '.xlc', '.xlm', '.xls', '.xlt', '.xlw', '.csv'].some(item => item === types)
      if (!fileType) {
        this.spinning = false
        return this.$message.error('文件格式错误！请重新选择')
      }
      setTimeout(() => {
        let wb = XLSX.readFile(file.path, { type: 'file' })
        let result = []
        wb.SheetNames.forEach(sheetName => {
          result.push({
            sheetName: sheetName,
            sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { 
              defval: '' // 无内容字段的默认值
            // range: 'A1:AZ2' // 得到范围内的表格值。
            })
          })
        })
        // 展示解析出来的表格
        this.showSheetsModal = true
        this.parseResult = result
        wb = null
        result = null
        this.spinning = false
      }, 300)
      return false
    },
    handleModalOk () {
      if (!this.selectColumn.length) return this.$notification.error({ message: '请选择需要的数据列' })
      const arr = this.parseResult[Number(this.sheetRadio)].sheet
      const temp = arr.reduce((acc, cur) => {
        if (cur[this.selectColumn].length) {
          acc.push(cur[this.selectColumn])
        }
        return acc
      }, [])
      if (!temp.length) {
        return this.$notification.error({ message: '所选列无数据' })
      }
      this.targetColumnData = temp.join('\n')
      this.showSheetsModal = false
    },
    handleModalCancel () {
      this.init()
    },
    handleToParse () {
      this.spinning = true
      setTimeout(() => {
        this.activeTab = '1'
        this.text = this.targetColumnData
        this.targetColumnData = ''
        this.startParse()
      }, 300)
    },
    beforeUpload () {
      return false
    },
    init () {
      this.names = ''
      this.errors = ''
      this.urls = []
      this.showSheetsModal = false // 表格解析出来的数据
      this.parseResult = []
      this.sheetRadio = null
      this.firstLine = []
      this.selectColumn = ''
      this.targetColumnData = ''
    }
  }
}
</script>
<style lang="less" scoped>
.section {
  padding: 5px;
  h3,h4 {
    font-weight: normal;
  }
  h4 {
    color:grey;
  }
  .actionButton {
    margin-top: 10px;
    display: block;
    margin-left: auto;
  }
  .buttonArea {
    margin-top: 10px;
    text-align: right;
  }
  .part {
    margin-top: 10px;
  }
  article {
    .ant-tag {
      margin-top: 5px;
    }
    .urlTag {
      max-height: 200px;
      overflow: scroll;
    }
  }
}
</style>
