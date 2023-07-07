<script setup lang="ts">
import { AxiosResponse } from 'axios'
import { ref } from 'vue'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { useUserSession } from '/@src/stores/userSession'
import { ContentLoader } from 'vue-content-loader'
import iconsMember from '/@src/assets/icons/member.json'
import iconsUp from '/@src/assets/icons/arrow-down.json'
import iconsDown from '/@src/assets/icons/arrpw-up.json'
const userSession = useUserSession()


const notif = useNotyf()

interface userReferral {
  id: string
  user_id: string
  referral_code: string
  team_count: number
  user: {
    id: string
    name: string
    email: string
  }
}

const props = defineProps<{
  user?: any
  isfirst?: boolean
  loading: boolean
}>()

const loading = ref(false)
const counter = 0
const loaded = ref(false)
const showNoChildMessage = ref(false)
const isClosedList = ref(false)
const childs = ref<userReferral[]>([])

const noChild = () => {
  showNoChildMessage.value = true
  setTimeout(function () {
    showNoChildMessage.value = false
  }, 2000)
  return
}

const ul_id = function () {
  return 'ul-' + props.user?.user_id
}

console.log(props.user)

const getUserReferrals = async () => {
  if (props.user?.team_count == 0) {
    noChild()
    return
  }

  if (loaded.value) {
    isClosedList.value = !isClosedList.value
    return
  }

  const api = useApi()
  loading.value = true
  loaded.value = true
  try {
    const data: AxiosResponse = await api.post<userReferral[]>('userChilds', {
      user_id: props.user?.user?.id,
    })
    childs.value = data.data
  } catch (error: any) {
    console.log(error)
    notif.dismissAll()
    notif.error('Bir Hata Oluştu bir daha deneyiniz')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="props.loading || loading" class="u-box">
    <content-loader viewBox="0 0 340 84" :speed="2" primaryColor="#282e3e" secondaryColor="#1d222e">
      <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
      <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
      <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
      <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
      <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
      <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
      <rect x="18" y="23" rx="3" ry="3" width="140" height="11" />
      <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
    </content-loader>
  </div>
  <div v-else :id="props.user?.id" class="u-box" @dblclick="; (counter += 1), getUserReferrals()">
    <div class="icon-status" v-if="isClosedList">
      <Vue3Lottie class="m-s-icon" :playOnHover="false" :loop="false" :autoPlay="true" :animationData="iconsUp"
        :height="20" :width="20" />
    </div>
    <div class="icon-status" v-else>
      <Vue3Lottie class="m-s-icon" :playOnHover="false" :loop="false" :autoPlay="true" :animationData="iconsDown"
        :height="20" :width="20" />
    </div>

    <Vue3Lottie class="m-h-icon" :playOnHover="true" :loop="true" :autoPlay="false" :animationData="iconsMember"
      :height="20" :width="20" />
    <h6 class="dark-inverted user-desplay-name">
      {{ props.user?.user.first_name as string }}
      {{ props.user?.user.last_name as string }}</h6>
    <div class="u-box-details">
      <p class="d-title mb-0">
        <span class="text-right w-50"> Childs count: </span>
        <span class="d-title-mob"> {{ props.user?.team_count }}</span>
      </p>
    </div>

    <div v-if="showNoChildMessage" class="no-child">
      <p>No childs</p>
    </div>
  </div>

  <ul v-if="
    !props.loading &&
    !loading &&
    props.user?.team_count as number > 0 &&
    childs.length > 0 &&
    !isClosedList
  " :id="ul_id" class="child-list">
    <li v-for="child in childs">
      <ReferralListTree :laoding="loading" :isfirst="false" :user="child"></ReferralListTree>
    </li>
  </ul>
</template>

<style lang="scss">
.icon-status {
  width: 24px;
  position: absolute;
  left: 6px;
  top: 6px;
  opacity: 0.7;
}

.user-desplay-name {
  font-size: 0.9em;
  text-transform: capitalize;
}

.u-box {
  flex: 1;
  display: inline-block;
  width: 100%;
  padding: 20px;
  background-color: #2d3448;
  border-radius: 5px;
  border: 1px solid #545b6d;
  transition: all 0.3s; // transition-all test
  flex: none;
  position: relative;
  width: 170px;
  transition: all 0.3s ease-in;
  overflow: hidden;
  display: block;
  position: relative;
  cursor: pointer;
  text-align: center;
  padding: 10px !important;

  &:hover,
  &:focus {
    .button-wrap {
      >div {
        a {
          opacity: 1;
          pointer-events: all;
        }
      }
    }
  }

  .dropdown {
    position: absolute;
    top: 10px;
    right: 10px;
    text-align: left;
  }

  >.v-avatar {
    display: block;
    margin: 0 auto 4px;
  }



  p {
    font-size: 0.85rem;
  }


}

.is-dark {
  .u-box {}
}

.no-child {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1e2746;
  z-index: 5;
  display: flex;
  overflow: hidden;
  transition: all 0.9s ease-in;
}

.no-child.hidden {
  display: none;
}

.no-child p {
  display: block;
  margin: auto;
  left: 0;
  right: 0;
  text-align: center;
  color: #d9d9d9;
  font-size: 0.9em;
  font-weight: 300;
}

.m-h-icon {
  width: 55px;
  display: block;
  margin: auto;
}
</style>