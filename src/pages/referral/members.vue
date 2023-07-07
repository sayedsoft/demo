<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'
import { ref } from 'vue'
import { AxiosResponse } from 'axios'
import { ContentLoader } from 'vue-content-loader'
import { useNotyf } from '/@src/composable/useNotyf'
import teamMember from '/@src/assets/icons/team.json'
const userSession = useUserSession()
const notif = useNotyf()

interface userReferral {
    id: string
    user_id: string
    referral_code: string
    team_count?: number
    user?: {
        id: string
        name: string
        email: string
    }
}

const isLoading = ref(true)
const userReferralData = ref<userReferral>()

const getUserReferral = async () => {
    const api = useApi()
    isLoading.value = true
    try {
        const data: AxiosResponse = await api.post<userReferral>('userReferral')
        userReferralData.value = data.data
    } catch (error: any) {
        console.log(error)
        notif.dismissAll()
        notif.error('Please try again')
    } finally {
        isLoading.value = false
    }
}
getUserReferral()

useHead({
    title: 'Referral members',
})
</script>


<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        Rererral
                        members
                    </h4>
                </div>
                <div class="card-content">
                    <div class="tree-diagram mb-4">
                        <ul>
                            <li class="li-first">
                                <ReferralListTree :isfirst="true" :loading="isLoading" :user="userReferralData">
                                </ReferralListTree>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card-footer">
                    <span v-if="!isLoading" class="mt-2 mb-2">Your child members count:
                        {{ userReferralData?.team_count }}</span>
                    <span v-else>
                        <content-loader :width="100" viewBox="0 0 340 84" :speed="2" primaryColor="#1d222e"
                            secondaryColor="#ecebeb">
                            <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
                            <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
                            <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
                            <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
                            <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
                            <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
                            <rect x="18" y="23" rx="3" ry="3" width="140" height="11" />
                            <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                        </content-loader>

                    </span>
                </div>
            </div>
        </div>


    </div>

</template>

<style lang="scss">
/* Hide scrollbar for Chrome, Safari and Opera */
.tree-diagram::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.tree-diagram {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.tree-diagram {
    width: 100%;
    overflow: scroll;
    padding-bottom: 30px;
}

.tree-diagram ul {
    display: flex;
    position: relative;

    /* Reset */
    list-style-type: none;
    margin: auto;
    padding: 1rem 0.5rem 0rem 0.5rem;
}

.tree-diagram ul ul::before {
    border-right: 2px solid #404045;
    content: '';

    /* Position */
    position: absolute;
    top: 0;
    right: 50%;

    /* Size */
    height: 1rem;
    width: 50%;
}

.tree-diagram li {
    padding: 1rem 0.5rem 0rem 0.5rem;
    position: relative;
    /* Center the content */
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: auto;
    left: 0;
    right: 0;
}

.tree-diagram li::before {
    border-right: 2px solid #404045;
    border-top: 2px solid #404045;
    content: '';

    /* Position */
    position: absolute;
    top: 0;
    right: 50%;

    /* Size */
    height: 1rem;
    width: 50%;
}

.tree-diagram li::after {
    border-top: 2px solid #404045;
    content: '';

    /* Position */
    position: absolute;
    top: 0;
    right: 0;

    /* Size */
    width: 50%;
}

.tree-diagram li:first-child::before,
.tree-diagram li:last-child::after {
    /* Remove the top of border from the first and last items */
    border-top: none;
}

/* Add a root item if you want */
li.tree-diagram__root::before {
    border-right: none;
}

.li-first::before {
    content: ' ';
    display: none;
}

.loading-tree.hidden {
    display: none;
}

.loading-tree {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1e2746;
    z-index: 15;
    display: flex;
    overflow: hidden;
    transition: all 0.3s ease-in;
}

.laoding-center {
    top: 0;
    bottom: 0;
    margin: auto;
}

.closed-list {
    display: none !important;
}
</style>
