<template>
         <foot></foot>
</template>>

<script>
  import axios from 'axios'

  export default { 
    created() { 
        // this.$http.get("/api/logins").then(response => { 
        //     this.users = response.data; 
        // }); 
    }, 
    data() { 
        return { 
            id:'asdf',
            pw:'1234',
            page:false
        }; 
    },
    methods: {
      loginClick(){
        console.log('로그인 클릭')
        axios.post('/', {
              org_id:this.id,
              user_pw:this.pw,
          })
          .then((r) => {
            console.log(r.data.page)
            this.page = r.data.page
            console.log(this.page)
          })
          .catch((e) => {
            alert("에러가 발생하였습니다.")
            console.error(e.message)
          })
      },
    }
}; 
</script>
