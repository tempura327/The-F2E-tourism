<template>
    <div>
        <b-carousel :interval="4000" indicators class="carousel">
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="../assets/unsplash_dQejX2ucPBs.png"></b-carousel-slide>
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="../assets/unsplash_eOpewngf68w.png"></b-carousel-slide>
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="../assets/unsplash_JsuBKjHGDMM.png"></b-carousel-slide>
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="../assets/unsplash_UWQP2mh5YJI.png"></b-carousel-slide>
            <b-carousel-slide caption="Welcome to Travel Taiwan" img-src="../assets/unsplash_Yizrl9N_eDA.png"></b-carousel-slide>
        </b-carousel>

        <b-input-group class="search">
            <b-select :options="typeOption" v-model="selectedType" class="search-input"></b-select>
            <b-select :options="cityOption" v-model="selectedCity" class="search-input"></b-select>    
            <!-- <b-input-append> -->
            <b-button variant="info" @click="search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2635 20.526C12.5407 20.5255 14.7523 19.7632 16.5461 18.3605L22.1859 24L24 22.186L18.3602 16.5465C19.7637 14.7526 20.5265 12.5407 20.5271 10.263C20.5271 4.60423 15.9226 0 10.2635 0C4.60448 0 0 4.60423 0 10.263C0 15.9217 4.60448 20.526 10.2635 20.526ZM10.2635 2.56575C14.5088 2.56575 17.9612 6.01796 17.9612 10.263C17.9612 14.508 14.5088 17.9602 10.2635 17.9602C6.01828 17.9602 2.56588 14.508 2.56588 10.263C2.56588 6.01796 6.01828 2.56575 10.2635 2.56575Z" fill="white"/>
                </svg>
            </b-button>
            <!-- </b-input-append> -->
        </b-input-group>
    </div>
</template>

<script>

export default({
    name:'Carousel',
    data(){
        return{
            cityOption:[
                {value:'All', text:'所有'},
                {value:'Taipei', text:'台北'},
                {value:'NewTaipei', text:'新北'},
                {value:'Keelung', text:'基隆'},
                {value:'桃園', text:'Taoyuan'},
                {value:'新竹', text:'Hsinchu'},
                {value:'苗栗', text:'Miaoli'},
                {value:'台中', text:'Taichung'},
                {value:'彰化', text:'Changhua'},
                {value:'南投', text:'Nantou'},
                {value:'雲林', text:'Yunlin'},
                {value:'嘉義', text:'Chiayi'},
                {value:'台南', text:'Tainan'},
                {value:'高雄', text:'Kaohsiung'},
                {value:'屏東', text:'Pingtung'},
                {value:'宜蘭', text:'Yilan'},
                {value:'花蓮', text:'Hualien'},
                {value:'台東', text:'Taitung'}                
            ],
            typeOption:[
                {value:'All', text:'所有'},
                {value:'scene', text:'自然風景'},
                {value:'sport', text:'體育健身'},
                {value:'travel', text:'遊憩'},
                {value:'heritage', text:'古蹟'},
            ],
            selectedCity:'',
            selectedType:'',
        }        
    },
    methods:{
        search(){
            
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
        top: 50%;
        bottom: 50%;
        padding: 0;
        
    }   
    
    .carousel-caption *{
        font-size: 32px;
        font-weight: 700;
    }

    .search{
        position: relative;
        top: -250px;
        width: 60%;
        margin: 0 auto;
    }

    .search-input{
        box-shadow: 4px 4px 11px rgba(0, 0, 0, 0.25);
        margin-right: 20px;
        border-radius: 8px;
    }
</style>