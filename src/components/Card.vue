<template>
    <b-card>
        <div class="card-img-frame  mb-8">
            <img :src="imgSrc" alt="" class="card-img">
        </div>
        <div class="pl-5 pr-5">
            <div class="d-flex align-items-center mb-4">
                <h2 class="card-title w-3 mr-3">{{title}}</h2>
                    <svg class="mr-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.57989 0.416687C3.63744 0.416687 0.429993 3.59427 0.429993 7.50002C0.429993 11.4058 3.63744 14.5834 7.57989 14.5834C11.5223 14.5834 14.7298 11.4058 14.7298 7.50002C14.7298 3.59427 11.5223 0.416687 7.57989 0.416687ZM7.57989 13.1667C4.42607 13.1667 1.85997 10.6245 1.85997 7.50002C1.85997 4.37556 4.42607 1.83335 7.57989 1.83335C10.7337 1.83335 13.2998 4.37556 13.2998 7.50002C13.2998 10.6245 10.7337 13.1667 7.57989 13.1667Z" fill="#6F7789"/>
                        <path d="M8.29485 3.95831H6.86487V8.20831H11.1548V6.79165H8.29485V3.95831Z" fill="#6F7789"/>
                    </svg>
                    <h6 class="card-type">{{type}} </h6>
            </div>

            <h4 class="mb-4">
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                    <path d="M5.99999 15C4.91736 14.1024 3.91387 13.1183 2.99999 12.0581C1.62857 10.4659 7.53336e-07 8.09468 7.53336e-07 5.83512C-0.000594015 4.68115 0.351007 3.55294 1.01031 2.59327C1.66961 1.63361 2.60697 0.885634 3.70376 0.444003C4.80056 0.0023718 6.00748 -0.113061 7.1718 0.112313C8.33611 0.337687 9.40547 0.893737 10.2445 1.71009C10.8032 2.2507 11.246 2.89364 11.5473 3.6017C11.8486 4.30976 12.0025 5.06888 12 5.83512C12 8.09468 10.3714 10.4659 8.99998 12.0581C8.0861 13.1183 7.0826 14.1024 5.99999 15ZM5.99999 3.33561C5.318 3.33561 4.66395 3.59895 4.18172 4.0677C3.69948 4.53645 3.42856 5.17221 3.42856 5.83512C3.42856 6.49803 3.69948 7.13379 4.18172 7.60254C4.66395 8.07129 5.318 8.33463 5.99999 8.33463C6.68197 8.33463 7.33602 8.07129 7.81826 7.60254C8.30049 7.13379 8.57141 6.49803 8.57141 5.83512C8.57141 5.17221 8.30049 4.53645 7.81826 4.0677C7.33602 3.59895 6.68197 3.33561 5.99999 3.33561Z" fill="#08A6BB"/>
                </svg>
                {{address}}
            </h4>
            <div class="d-flex justify-content-center">
                <button class="btn" @click="showModal(data)">了解更多</button>
            </div>
        </div>
    </b-card>
</template>

<script>
    export default({
        name:'Card',
        props:{
            data:{
                type:Object
            },
            imgSrc:{
                type:String
            },
            title:{
                type:String
            },
            type:{
                type:String
            },
            address:{
                type:String
            },
        },
        methods:{
            showModal(data){
                console.log(data);
            }
        }
    })
</script>

<style scoped>
    .card{
        width: 100%;
        min-height: 360px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px rgba(255, 255, 255, 0.6), 4px 4px 20px rgba(111, 140, 176, 0.41);
    }


    .card-img-frame{
        height: 150px;
        overflow: hidden;
    }
</style>