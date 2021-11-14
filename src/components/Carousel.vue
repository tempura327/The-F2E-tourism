<template>
    <div>
        <b-carousel :interval="4000" indicators class="carousel">
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="https://images.unsplash.com/photo-1636443510795-64c80818263d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"></b-carousel-slide>
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="https://images.unsplash.com/photo-1563867298409-f33e059c2ad9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"></b-carousel-slide>
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="https://images.unsplash.com/photo-1542312743-e4a4a04f412a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80"></b-carousel-slide>
        </b-carousel>

        <div class="search-area">
            <b-select :options="typeOption" v-model="selectedType" class="w-20 search-input"></b-select>
            <b-select :options="cityOption" v-model="selectedCity" class="w-40 search-input"></b-select>    

            <button  @click="search" class="btn-search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2635 20.526C12.5407 20.5255 14.7523 19.7632 16.5461 18.3605L22.1859 24L24 22.186L18.3602 16.5465C19.7637 14.7526 20.5265 12.5407 20.5271 10.263C20.5271 4.60423 15.9226 0 10.2635 0C4.60448 0 0 4.60423 0 10.263C0 15.9217 4.60448 20.526 10.2635 20.526ZM10.2635 2.56575C14.5088 2.56575 17.9612 6.01796 17.9612 10.263C17.9612 14.508 14.5088 17.9602 10.2635 17.9602C6.01828 17.9602 2.56588 14.508 2.56588 10.263C2.56588 6.01796 6.01828 2.56575 10.2635 2.56575Z" fill="white"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>

export default({
    name:'Carousel',
    data(){
        return{
            cityOption:[
                {value:null, text:'所有', disabled: true},
                {value:'Taipei', text:'台北'},
                {value:'NewTaipei', text:'新北'},
                {value:'Keelung', text:'基隆'},
                {text:'桃園', value:'Taoyuan'},
                {text:'新竹', value:'Hsinchu'},
                {text:'苗栗', value:'Miaoli'},
                {text:'台中', value:'Taichung'},
                {text:'彰化', value:'Changhua'},
                {text:'南投', value:'Nantou'},
                {text:'雲林', value:'Yunlin'},
                {text:'嘉義', value:'Chiayi'},
                {text:'台南', value:'Tainan'},
                {text:'高雄', value:'Kaohsiung'},
                {text:'屏東', value:'Pingtung'},
                {text:'宜蘭', value:'Yilan'},
                {text:'花蓮', value:'Hualien'},
                {text:'台東', value:'Taitung'}                
            ],
            typeOption:[
                {value:null, text:'所有'},
                {value:'scene', text:'自然風景'},
                {value:'sport', text:'體育健身'},
                {value:'travel', text:'遊憩'},
                // {value:'heritage', text:'古蹟'},
            ],
            selectedCity:null,
            selectedType:null,
        }        
    },
    methods:{
        async search(){
            if(this.selectedCity){
                
                try{
                  let res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${this.selectedCity}?$top=30&$format=JSON`, {
                    method:'GET',
                    header:{
                      Authorization:'hmac username=83592d8c997f4933ae965e60e5995a2d',
                      'X-Date':new Date().toGMTString(),
                    },
                    'Accept-Encoding': 'gzip'
                  })

                  res.json().then((d) => {
                    localStorage.setItem('attractionData', JSON.stringify(d));
                    this.$store.commit('setAttractionData', d);
                  })
                }catch{
                  console.log('fail');
                }finally{
                  if(this.$router.currentRoute.fullPath !== '/attraction'){
                    this.$router.push('/attraction');
                  }                  
                }                
            }else if(this.selectedType){
                
                try{
                  let res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/Taipei?$filter=Class1 eq '${this.selectedType}' or Class2 eq '${this.selectedType}' or Class3 eq '${this.selectedType}'&$top=30&$format=JSON`, {
                    method:'GET',
                    header:{
                      Authorization:'hmac username=83592d8c997f4933ae965e60e5995a2d',
                      'X-Date':new Date().toGMTString(),
                    },
                    'Accept-Encoding': 'gzip'
                  })

                  res.json().then((d) => {
                    localStorage.setItem('activityData', JSON.stringify(d));
                  })
                }catch{
                  console.log('fail');
                }finally{
                  // this.$router.push('/activity');
                  
                }
            }
        }
    }
})
</script>



<style>
    .carousel-item{
        height: 600px;
    }

    .carousel-indicators li{
        width: 12px;
        height: 12px;
        background-color: white;
        border-radius: 50%;
    }

    .carousel-caption {
        bottom: 40% !important;
        padding: 0;        
    }   
    
    .carousel-caption *{
        font-size: 32px !important;
        font-weight: 700;
        color: white;
        text-shadow: 10px 8px 12px rgba(0, 0, 0, 0.37);  
        font-style: italic;      
    }
    .search-area{
        position: relative;
        top: -250px;
        left: 280px;
        display: inline;
    }

    .search-input{
        
        box-shadow: 4px 4px 11px rgba(0, 0, 0, 0.25);
        margin-right: 20px;
        border-radius: 8px;
        z-index: 20;
    }
</style>