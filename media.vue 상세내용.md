# 미디어 공간

# 1. slider-bar Q&A click

![Untitled/media.png](Untitled/media.png)

## 1-1 Media.vue page router.js 등록

    {
    //router.js에 Media.vue 파일의 path를 /media로 지정하여 router 등록
    path: '/media',

    name: 'media',

    component: () => import( './views/Media.vue')

    },

# 2.미디어공간 메인Media.vue

![Untitled/Untitled.png](Untitled/Untitled.png)

## 2-1 검색기능

미디어 공간 검색

1.검색어입력

데이터의 모든 내용 검색가능

    v-text-field
                flat
                v-model="search"
                 prepend-inner-icon="search"
                label="검색어입력"
                single-line
                hide-details
                ></v-text-field>
    <v-btn-toggle
                  v-model="sortDesc"
                  mandatory
                >
                </v-btn-toggle>

2.고객별

 원하는 기업 콤보박스에 입력 db에 저장

    <v-select
                  v-model="sortBy"
                  flat             
                  hide-details
                  :items="keys"
                  prepend-inner-icon="search"
                  label="고객별"
                ></v-select>

## 2.2대표이미지 설정

고정이미지 배경

![Untitled/Untitled%201.png](Untitled/Untitled%201.png)

고정이미지 아이콘-오른쪽 하단에 고정으로 위치

![Untitled/Untitled%202.png](Untitled/Untitled%202.png)

바뀌는 컨텐츠 이미지(변경)-둥근모양으로 배경안에 삽입

![Untitled/Untitled%203.png](Untitled/Untitled%203.png)

    <!-- 고정이미지 -->
                    <v-img src="@/assets/mediabg.png" width="7rem">
                    <!-- 고정이미지 -->
                    <!-- 바뀌는 컨텐츠이미지               -->
                      <v-img  class="rounded"  src="@/assets/mario.png" >                      
                      <!-- 바뀌는 컨텐츠이미지              -->
                      </v-img>
                      <!-- 고정아이콘 -->
                        <v-icon style="color: white;"
                        class="playbtn"
                        large>mdi-play-circle-outline
                        </v-icon>

## 2-3 미디어 title checkbox(v-data-iterator)

### 2-3-1

미디어 이름과 체크박스로 체크박스 클릭시 상단에 v-chip 생성

![Untitled/Untitled%204.png](Untitled/Untitled%204.png)

check selected에 저장하고 template v-slot으로 라벨에 대표이름 표시

    <v-checkbox id="cb1"  :value="item.name" v-model="selected" color="primary"  >
               <template v-slot:label>
                  <div  color="black" class="titlecheckbox">
                    {{ item.name }} </div>
               </template>    
             </v-checkbox>

chip을 생성해주는 부분-콤보박스에 체크된 내용 상단에 칩으로 표시

    <v-chip
                  color="primary"
                  v-if="chip2"
                  v-model="chip2"
                  :disabled="loading"
                  close
                  @click:close="remove(item)"
                 >
                 {{selected}}
                </v-chip>

chips 닫는 함수

    remove (item) {
          this.selected.splice(this.selected.indexOf(item), 1)
          this.selected = [...this.selected]
        },

### 2-3-2 dot-horzontal icon 클릭시 메뉴바생성

![Untitled/Untitled%205.png](Untitled/Untitled%205.png)

휴지통과 수정하기 화면으로 넘어가는 메뉴바 생성

휴지통 개발 완성시 휴지통 클릭 메소드 수정 보완 예정(임시데이터 수정화면으로

    <v-menu bottom left  close-on-click min-width=7rem>            
                      <template v-slot:activator="{ on }">
                        <v-btn
                          dark
                          icon
                          v-on="on"
                        >
                            <v-icon dark fixed> mdi-dots-horizontal</v-icon>
                            </v-btn>
                            </template>
                      <div class="text-center">
                          <v-list>
                          <v-list-item style="place-content: center; color:black;" >
                            <v-btn icon >
                              <v-list-item-title style="color:black;">
                                <v-btn @click="mediaedit(item)">휴지통</v-btn>
                              </v-list-item-title>
                            </v-btn>
                          </v-list-item>
                        <v-divider></v-divider>
                          <v-list-item style="place-content: center; color:black;">
                            <v-btn icon >
                              <v-list-item-title style="color:black;">
                                <v-btn @click="mediaedit(item)">수정하기</v-btn>
                              </v-list-item-title>
                            </v-btn>
                          </v-list-item>
                        </v-list>
                      </div>         
                  </v-menu>

## 2-4 v-card로 데이터를 표시

v-card로 데이터를 표시

카테고리부분은 칩으로 추가 보완할예정

![Untitled/Untitled%206.png](Untitled/Untitled%206.png)

사이즈 작성일 해상도 카테고리 표시

가상데이터 item.size item.added, item.resolution,item.category를 입력한 내용

    <v-list-item>

                      <v-list-item-content>사이즈:</v-list-item-content>

                      <v-list-item-content class="align-end">{{ item.size }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                              <v-list-item-content>작성일:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.added }}</v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                              <v-list-item-content>해상도:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.resolution }}</v-list-item-content>
                           </v-list-item>   
                           <v-list-item>
                              <v-list-item-content>재생시간:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.duration }}</v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                              <v-list-item-content>카테고리:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.category }}</v-list-item-content>
                    </v-list-item>

## 2-5 페이지 이동 기능과 페이지당 원하는 카드 표시

vuetifty  v-pagination 이용

![Untitled/Untitled%207.png](Untitled/Untitled%207.png)

[]()

    <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible=10
          circle
        >
        </v-pagination>

클릭시 새로운 페이지 표시

    mounted(){
          this.pageCount = Math.ceil(this.items.length / this.itemsPerPage)
        },

{{number}}현재 한페이지 당 원하는 데이터 표시

    <v-list-item
                      v-for="(number, index) in itemsPerPageArray"
                      :key="index"
                      @click="updateItemsPerPage(number)"
                    >
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>

한페이지당 5,15,20,25개까지 볼수있는 데이터

    export default {

        data () {
              return {
            itemsPerPageArray: [5,10,15,20,25],
       }
    }
    }

## 3 미디어 정보 보기

../components/mediainfo.vue

## 3-1 미디어 이미지 클릭시 dialog 생성

![Untitled/Untitled%208.png](Untitled/Untitled%208.png)

클릭시  media.vue 의 코드

    <div class="videoslist">
                 <v-btn  icon rounded width="6rem" height="6rem"  @click="mediainfo(item)">  
                    <div>


mediainfo 메소드 호출, eventbus로 mediainfo.vue로 데이터 전달

    methods:{
    mediainfo (item){
            EventBus.$emit("mdinfo", item )
          },
    }

클릭후 mediainfo.vue로 dialog 생성

![Untitled/Untitled%209.png](Untitled/Untitled%209.png)

event  bust on으로 media.vue에서 보냈던 mdfino의 데이터를 mediainfo.vue에서 event on으로 받음

    mounted(){
          EventBus.$on("mdinfo",(item) => {

             this.editname=item.name
            this.editsize =item.size
            this.editresolution=item.resolution
            this.editduration=item.duration
            this.editcategory=item.category    
            this.e6.states=item.category
             this.dialog=true
        });

## 3-2 미디어 정보 표시 -변경데이터(이름)

![Untitled/Untitled%2010.png](Untitled/Untitled%2010.png)

<div v-if="!isStatusOn">으로 수정화면에선 이름이 보이지 않게 작성

    <div v-if="!isStatusOn">
                    <v-card-title>
                  <span> {{editname}} </span>
                </v-card-title>
                </div>

## 3-3 미디어 정보 표시-고정데이터(크기, 작성일, 재생시간)

고정적으로 수정 불가능한 동영상 데이터 표시

![Untitled/Untitled%2011.png](Untitled/Untitled%2011.png)

고정적으로 수정 불가능한 동영상 데이터 표시

    <div class="allshow">
                      <viewer
                             v-model="editadded"
                             label="작성일*"
                             required                        
                             >
                             <v-row justify="left">     {{editsize}}
                        </v-row>
                        </viewer>
                   </div>

              <v-list-item-subtitle>작성일</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
           <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-play-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">

                  <div class="allshow">
                      <viewer               
                           v-model="editduration"
                             label="재생 시간*"
                            solo
                             >
                        <v-row justify="left">     {{editduration}}
                        </v-row>
                        </viewer>
                   </div>

              <v-list-item-subtitle>재생 시간</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
            <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-view-grid</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">

                  <div class="allshow">

## 3-4 미디어 정보 표시-변경(설명, 카테고리)

textfield의 속성 readonly를 이용하여 정보수정 불가능 읽기만 가능

![Untitled/Untitled%2012.png](Untitled/Untitled%2012.png)

<div v-else>로 readonly속성과 outline속성은 수정시 상태 변경

    <div v-else>
    <v-text-field
                                        dense
                                        readonly
                                          v-model="editcategory"
                                          label="카테고리*"
                                          solo
                                            >
                                      </v-text-field>

                              </div>
            </div>

              <v-list-item-subtitle>카테고리</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
           <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-message-bulleted</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">

                  <div class="allshow">
          <!-- readonly, outline  read값으로 변경가능 불가능 설정          -->
          <v-textarea
           style="min-height: 7rem;"
           v-model="editdetail"
           dense   
           solo
           required
           :readonly="read"
           :outlined="editout"
          ></v-textarea>
                </div>   
              <v-list-item-subtitle>설명</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>



    </v-list>

# 4 미디어 정보 수정 및 다운로드 버튼

![Untitled/Untitled%2013.png](Untitled/Untitled%2013.png)

## 4-1 미디어 정보 수정 버튼

정보수정버튼클릭

![Untitled/Untitled%2014.png](Untitled/Untitled%2014.png)

:readonly의 변수명 read

solo의 변수명 solo

outline의 변수명 editout으로 정보수정버튼시 수정가능화면으로 변환

    <v-btn icon  @click="mediaInfoEdit2()">
    //클릭시 메소드 호출

    mediaInfoEdit2(){
            this.read=false;
            this.editsolo=true;
           this.editout=true;
            // this.isStatusOn = !this.isStatusOn;
             this.isStatusOn = true;
          },

## 4-2 미디어 정보 미디어 이름 수정

상단의 이름이 사라지고 수정가능텍스트파일 생성

![Untitled/Untitled%2015.png](Untitled/Untitled%2015.png)

<div v-if="isStatusOn">부분으로 정보수정 버튼 클릭시 이름 수정화면 표시

    <div v-if="isStatusOn">
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-account-check</v-icon>
            </v-list-item-icon>

            <v-list-item-content class="allshow" >
                 <div class="allshow">
                         <v-text-field
                             dense
                            solo
                             v-model="editname"
                             label="이름*"
                             required
                             :readonly="read"
                              :outlined="editout"
                             >
                        </v-text-field>

                   </div>

              <v-list-item-subtitle>이름</v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>
      </div>

## 4-3미디어 정보 카테고리(태그), 설명 수정

### 4-3-1카테고리

![Untitled/Untitled%2016.png](Untitled/Untitled%2016.png)

원하는 태그 입력후 엔터후 v-chip 생성

    <v-combobox
                     style="min-width:20rem;"
        v-model="chips"
        :items="items"
        chips
        clearable
        label="카테고리"
        multiple

        solo
      >
            <template v-slot:selection="{ attrs, item, select, selected }">
          <v-chip
            v-bind="attrs"
            :input-value="selected"
            close
            @click="select"
            @click:close="removechip(item)"
          >
            <strong>{{ item }}</strong>&nbsp;

          </v-chip>

        </template>
                  </v-combobox>

close닫는  removechip 메소드호출

    removechip (item) {
            this.chips.splice(this.chips.indexOf(item), 1)
            this.chips = [...this.chips]
          },

### 4-3-2 미디어 정보 설명 수정

reonly="read" outline="editout" 의 변수명 설정으로 수정하기 버튼 클릭시 화면에 표시

    <v-textarea
           style="min-height: 7rem;"
           v-model="editdetail"
           dense   
           solo
           required
           :readonly="read"
           :outlined="editout"
          ></v-textarea>

## 4-4미디어 정보 다운로드버튼

html5에서 제공하는 다운로드 폼

    <!-- html5에서 제공하는 download -->
               <a href="../test.mp4" download>
                <v-btn icon>
                 <v-icon color="indigo">mdi-arrow-collapse-down</v-icon>
                </v-btn>
                </a>
                다운로드

## 4-5 미디어 저장 취소 버튼

미디어 수정시 생기는 저장 취소 버튼

![Untitled/Untitled%2017.png](Untitled/Untitled%2017.png)

<div v-if="isStatusOn">로 수정하기 버튼 클릭시 생성버튼

    <div v-if="isStatusOn">
             <v-btn
            color="primary"
            v-model="savebtn"

             >
             저장
             </v-btn>
             <v-btn
             color="error"
            @click="mediaInfocancel()"
               v-model="closebtn"
             >
             취소
             </v-btn>
             </div>

최소시  이전화면으로 되돌아가는 버튼  mediaInfocancel메소드 호출

    mediaInfocancel(){
            this.read=true;
            this.editsolo=false;
           this.editout=false;
            // this.isStatusOn = !this.isStatusOn;
             this.isStatusOn = false;
          },

메소드 실행시 이전화면으로 돌아가게 속성값 변경

# 5. 영상업로드

## 5-1영상업로드 dialog 생성

영상업로드 버튼클릭

![Untitled/Untitled%2018.png](Untitled/Untitled%2018.png)

media.vue에서 영상업로드 버튼 클릭시 mediaupload메소드 호출

    <button _ngcontent-mmy-c10 class="btn btn-default" @click="mediaupload(item)">
                  영상 업로드</button>

    mediaupload (item){
            EventBus.$emit("mdupload",item )
          },

클릭후

 ../components/mediaupload.vue의 dialog 생성

    methods:{
    mediainfo (item){
            EventBus.$emit("mdinfo", item )
          },
    }

클릭후 mediainfo.vue로 dialog 생성

![Untitled/Untitled%2019.png](Untitled/Untitled%2019.png)

데이터를 eventBus.on으로 media.vue에서 보내준 mdupload 받음

    mounted(){
          EventBus.$on("mdupload",(item) => {     

             this.dialog=true
        });

        },

## 5-2 미디어 업로드(이름, 카테고리, 설명)

![Untitled/Untitled%2020.png](Untitled/Untitled%2020.png)

### 5-2-1 미디어 업로드 이름

이름 텍스트필드 부분 :rules설정으로 미입력시 경고표시 노출

    <v-col cols="20" >
                  <div class="colupload">        
                      <v-text-field
                      v-model="name"
                      :counter="20"
                      :rules="nameRules"
                      label="미디어이름*"
                        prepend-inner-icon="mdi-arrow-right-drop-circle"
                      required
                      >
                      </v-text-field>
                  </div>        
                </v-col>

rule설정코드

    nameRules: [
            v => !!v || '미디어 이름을 입력해주세요',
            v => (v && v.length <= 20) || '20글자 초과 하실 수 없습니다.',
          ],

### 5-2-2미디어 업로드 카테고리

    <v-combobox
                     style="min-width:20rem;"
        v-model="chips"
        :items="items"
        chips
        clearable
        label="카테고리"
        multiple

        solo
      >
            <template v-slot:selection="{ attrs, item, select, selected }">
          <v-chip
            v-bind="attrs"
            :input-value="selected"
            close
            @click="select"
            @click:close="removechip(item)"
          >
            <strong>{{ item }}</strong>&nbsp;

          </v-chip>

        </template>
                  </v-combobox>

close닫는  removechip 메소드호출

    removechip (item) {
            this.chips.splice(this.chips.indexOf(item), 1)
            this.chips = [...this.chips]
          },

### 5-2-3미디어 업로드 설명 내용

미디어업로드 텍스트에어리어 부분 :rules설정으로 미입력시 경고표시 노출

    <v-col cols="12">
                          <div class="colupload">    
                            <v-textarea
                            style="min-height: 10rem;"
                              v-model="detail"
                              outlined
                              :counter="200"
                              :rules="detailRules"
                              label="설명*"
                              prepend-inner-icon="mdi-message-bulleted"
                              required
                            ></v-textarea>
                          </div>
                  </v-col>

rule 설정

    detailRules: [
            v => !!v || '설명을 입력해주세요',
            v => (v && v.length <= 200) || '200글자 초과 하실 수 없습니다.',
          ],

## 5-3미디어 업로드 동영상 업로드

동영상업로드

![Untitled/Untitled%2021.png](Untitled/Untitled%2021.png)

클립 클릭후

![Untitled/Untitled%2022.png](Untitled/Untitled%2022.png)

file-input 속성 accept로 비디오파일만 업로드 가능코드

    <v-file-input
                      v-model="video"
                      accept="video/*"
                      placeholder="동영상 추가"
                      prepend-inner-icon="mdi-video"
                      label="동영상"
                    ></v-file-input>

# 6.미디어 영상요청



## 6-1영상요청 버튼클릭

![Untitled/Untitled%2023.png](Untitled/Untitled%2023.png)

media.vue에서 영상요청 버튼 클릭시 mediarequest메소드 호출

    <button _ngcontent-mmy-c10 class="btn btn-default" @click="mediarequest(item)">
                  영상 요청</button>

    mediarequest (item){
            EventBus.$emit("mdrequest", item )
          },

클릭후

 ../components/mediarequest.vue의 dialog 생성

![Untitled/Untitled%2024.png](Untitled/Untitled%2024.png)

eventBus.on으로 media.vue에서 보낸 데이더 받음

    mounted(){
          EventBus.$on("mdrequest",(item) => {


             this.dialog=true
        });

## 6-2미디어 요청 미디어목적

미디어 목적 표시 텍스트 필드 rules 설정으로 미입력시 경고 노출

    <v-text-field       
            v-model="name"
            :counter="20"
            :rules="nameRules"
            label="미디어 목적*"
              prepend-inner-icon="mdi-arrow-right-drop-circle"
            required
          ></v-text-field>

rules

    nameRules: [
            v => !!v || '미디어 이름을 입력해주세요',
            v => (v && v.length <= 20) || '20글자 초과 하실 수 없습니다.',
          ],

## 6-3미디어 요청 미디어 만료일

클릭시 datepicker 표시

![Untitled/Untitled%2025.png](Untitled/Untitled%2025.png)

### 6-3-1 미디어 요청 미디어 만료일 메뉴

만료일 클릭이 띄워주는 메뉴 생성코드 textfield 클릭시 datepicker 생성

    <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="10"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{on}">
              <v-text-field
                v-model="date"
                label="만료일"
               :rules="dateRules"
               :readonly="readonly"
                prepend-inner-icon="mdi-calendar"
                v-on="on"

              ></v-text-field>
            </template>
            <v-date-picker locale="ko"
     v-model="date" @input="menu = false"></v-date-picker>
          </v-menu>

### 6-3-2 미디어 요청 만료일 달력

vuetify에서 제공된느 달력으로 만료일 설정가능

    <v-date-picker locale="ko"
     v-model="date" @input="menu = false"></v-date-picker>

## 6-4 미디어 요청 요구사항

미디어 요청 요구사항 텍스트 필드

![Untitled/Untitled%2026.png](Untitled/Untitled%2026.png)

요구사항 rules설정, 200글자 제한

    <v-textarea
           style="min-height: 10rem;"
            v-model="detail"
            outlined
           :counter="200"
            :rules="detailRules"
            label="요구사항*"
            prepend-inner-icon="mdi-message-bulleted"
            required
          ></v-textarea>

    etailRules: [
            v => !!v || '요구사항을 입력해주세요',
            v => (v && v.length <= 200) || '200글자 초과 하실 수 없습니다.',
          ],

## 6-5 참조 프로젝트 추가

참조프로젝트 클립 버튼 클릭시 프로젝트 추가 가능

![Untitled/Untitled%2027.png](Untitled/Untitled%2027.png)

클립 클릭후

![Untitled/Untitled%2028.png](Untitled/Untitled%2028.png)

참조프로젝트 이미지 비디오 pdf문서  파일 업로드가능 accept로 지정

    <v-col cols="12" >
                <div class="colupload">    
          <v-file-input   
          v-model="file"
        accept="image/*, video/*, audio/*,application/pdf"
        placeholder="참조프로젝트 추가"
        prepend-inner-icon="mdi-file"
        label="참조프로젝트"
        value="filevalue"
    >
     <template v-slot:selection="{ index, text }">

                          {{ text }}

      </template>

        </v-file-input>
                ※컨텐츠의 비전을 설명하는 이미지 또는 비디오를 제공하십시오
                </div>

        </v-col>

## 6-6 하이퍼비전 사용 갯수

하이퍼 비전 사용갯수 가로 세로로 원하는 하이퍼비전 갯수 요청

![Untitled/Untitled%2029.png](Untitled/Untitled%2029.png)

### 6-6-1 하이퍼비전 사용갯수 예시 i아이콘 클릭

메뉴바로 i아이콘 클릭시 예시이미지 띄움

![Untitled/Untitled%2030.png](Untitled/Untitled%2030.png)

메뉴클릭시 이미지 노출 template v-slot:activator 사용

    <v-menu
          v-model="menus"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{on}">
            <v-btn
              color="indigo"
              dark
              icon
              v-on="on"
            >
             <v-icon color=#6c98c3>mdi-information</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>

                  <img width="100%" height="200rem" src="@/assets/mediaexample.jpg" >

                </v-list-item>
            </v-list>
          </v-card>    <!--  -->
        </v-menu>

### 6-6-2 가로세로 입력 v-select

1~10까지가상데이터 입력 최대 10x10=100

![Untitled/Untitled%2031.png](Untitled/Untitled%2031.png)

가로와 세로 v-select 사용 코드

    <v-select
                v-model="width"
                label="가로"
               :rules="widthRules"
               :items="number"
               :readonly="readonly"
                prepend-inner-icon="mdi-table-column-width"

              >
             </v-select>
              &nbsp;
             <strong >x</strong>
               &nbsp;
               <v-select
                v-model="height"
                label="세로"
                numberOnly
                :items="number"
               :rules="heightRules"
                prepend-inner-icon="mdi-table-row-height"

              ></v-select>
