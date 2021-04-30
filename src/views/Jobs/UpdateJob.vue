<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
    </base-header>
    <b-container fluid class="mt--6" v-if="isLoading">
      <card> <dpmx-cl></dpmx-cl></card>
    </b-container>
    <job-detail
      :job="job"
      mode="edit"
      ref="jobDetail"
      :submitting="submitting"
      v-if="!isLoading"
      v-on:formSubmit="updateJob"
      @imgChange="onFileChange"
    ></job-detail>
  </div>
</template>
<script>
import JobDetail from './component/JobDetail'
import { cloneDeep } from '@/core/utils/common'
import imageService from '@/api/imageService'
import jobService from '@/api/jobService'
export default {
  components: { JobDetail },
  data() {
    return {
      job: {
        image_url: 'img/theme/img-1-1000x900.jpg',
        id: 0,
        name: '',
        short_description: '',
        long_description: '',
        country_code: 'VN',
        min_degree: 'uni_undergraduate',
        industry: '',
        type: 'graduated',
        application_link: '',
        reviewed_link: '',
        open_at: new Date(),
        close_at: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
      imageFile: null,
      submitting: false,
      isLoading: false,
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      // get job
      this.isLoading = true
      const id = this.$route.params.id
      let res = await jobService.getJobById(id)
      if (res && res.success && res.job) {
        res.job.open_at = res.job.open_at * 1000
        res.job.close_at = res.job.close_at * 1000
        this.job = res.job
        this.isLoading = false
      } else {
        success = false
        let errMsg = 'Something went wrong'
        if (res && !res.success && res.message) {
          errMsg = res.message
        }
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: errMsg,
        })
      }
    },
    async updateJob() {
      const newJob = cloneDeep(this.job)
      newJob.open_at = new Date(this.job.open_at.toString()).getTime() / 1000
      newJob.close_at = new Date(this.job.close_at.toString()).getTime() / 1000
      // upload image
      this.submitting = true
      if (this.imageFile) {
        const res = await imageService.uploadImage(this.imageFile)
        if (
          !this.handleResponseServer(res, (res) => {
            if (res.image) {
              newJob.image_url = res.image.src
              newJob.image_id = res.image.id
            }
          })
        ) {
          this.submitting = false
          return
        }
      }
      const jRes = await jobService.updateJob({ job: newJob })
      if (
        !this.handleResponseServer(jRes, () => {
          this.$notify({
            verticalAlign: 'bottom',
            horizontalAlign: 'center',
            type: 'success',
            message: 'Save job successfully!',
          })
        })
      ) {
        this.submitting = false
        return
      }
      this.submitting = false
    },
    handleResponseServer(res, doSuccess = null, doFail = null) {
      let success = true
      if (res && res.success) {
        if (doSuccess !== null) {
          doSuccess(res)
        }
      } else {
        success = false
        let errMsg = 'Something went wrong'
        if (res && !res.success && res.error_message) {
          errMsg = res.error_message
        }
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: errMsg,
        })
        if (doFail !== null) {
          doFail(res)
        }
      }
      return success
    },
    onFileChange(file) {
      this.imageFile = file
    },
  },
}
</script>
<style></style>
