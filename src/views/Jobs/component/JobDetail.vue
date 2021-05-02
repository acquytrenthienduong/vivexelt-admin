<template>
  <b-container fluid class="mt--6">
    <b-row>
      <!-- Job Detail -->
      <b-col xl="12">
        <card>
          <b-row align-v="center" slot="header">
            <b-col>
              <h3 class="mb-0">{{ title }}</h3>
            </b-col>
          </b-row>

          <b-form @submit.prevent="onSubmit">
            <div class="pl-lg-4">
              <b-row>
                <b-col lg="8">
                  <base-input
                    type="text"
                    label="Title"
                    placeholder="Title"
                    v-model="post.title"
                    name="Title"
                    ref="title"
                    :rules="{ required: true }"
                  >
                  </base-input>
                </b-col>
              </b-row>
            </div>
            <div class="pl-lg-4">
              <b-row>
                <b-col lg="8">
                  <base-textarea
                    type="text"
                    label="Short Description"
                    placeholder="Short Description"
                    v-model="post.short_description"
                    name="Short Description"
                    ref="short_description"
                    :rules="{ required: true, max: 500 }"
                  >
                  </base-textarea>
                </b-col>
              </b-row>
            </div>
            <div class="pl-lg-4">
              <b-row>
                <b-col lg="8">
                  <b-form-file
                    label="Image thumbnail"
                    @input="fileChanges"
                    v-model="imgFile"
                    placeholder="Select file"
                    drop-placeholder="Drop file here..."
                    accept="image/jpeg, image/png"
                    class="button"
                  ></b-form-file>
                </b-col>
              </b-row>
            </div>
            <hr class="my-4" />

            <h6 class="heading-small text-muted mb-4">Long Description</h6>
            <dpmx-editor
              :value="post.long_description"
              v-model="post.long_description"
              :height="500"
            />

            <hr class="my-4" />
            <base-button
              type="primary"
              :disabled="submitting"
              :loading="submitting"
              native-type="submit"
              class="my-4"
            >
              {{ btnSubmitTitle }}
            </base-button>
          </b-form>
        </card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/themes/material_green.css'
import {
  MapMinimumDegree,
  MapJobType,
  MapJobStatus,
  JobStatus,
  MinimumDegree,
  JobType,
} from '../constant/constant'
import countryService from '@/api/countryService'
import postService from '@/api/postService'

export default {
  components: { flatPicker },
  name: 'job-detail',
  props: {
    post: {
      type: Object,
      default: () => {
        return {
          title: '',
          short_description: '',
          long_description: '',
          image_thumbnail: '',
          seoTitle: '',
        }
      },
      // create / edit
    },
    mode: {
      type: String,
      default: 'create',
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      datePickerConfig: {
        allowInput: true,
        mode: 'single',
        enableTime: true,
      },
      countries: [],
      isLoading: false,
      imgFile: null,
    }
  },
  computed: {
    title() {
      return this.mode === 'create' ? 'Create Post' : 'Update Post'
    },
    getMinimumDegrees() {
      return MinimumDegree.map((s) => {
        let name = MapMinimumDegree().get(s) || s
        return { name: name, value: s }
      })
    },
    getJobTypes() {
      return JobType.map((s) => {
        let name = MapJobType().get(s) || s
        return { name: name, value: s }
      })
    },
    openAtConfiguration() {
      return Object.assign({}, this.datePickerConfig, {
        minDate: 'today',
        onChange: this.onOpenAtOnChange(selectedDates, dateStr, instance),
      })
    },
    closeAtConfiguration() {
      let openAt = new Date(this.job.open_at)
      let minDate = new Date(openAt.setDate(openAt.getDate() + 1))
      return Object.assign({}, this.datePickerConfig, {
        minDate: minDate,
        defaultDate: minDate,
      })
    },
    btnSubmitTitle() {
      return this.mode === 'create' ? 'Create' : 'Update'
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // await this.getAllCountries()
    },
    async onSubmit() {
      if (this.validate() && this.mode === 'create') {
        this.post.seoTitle = this.removeAccents(this.post.title)
        console.log(this.post)
        let res = await postService.createPost(this.post)
        console.log(res)
        if (res && res.success) {
          this.$notify({
            verticalAlign: 'bottom',
            horizontalAlign: 'center',
            type: 'success',
            message: 'Create success',
          })
        }
      }
    },
    validate() {
      let refs = this.$refs
      let valid = true
      Object.keys(refs).forEach((ref) => {
        const currentRef = refs[ref]
        currentRef
          .validate()
          .then((res) => {
            if (!res.valid) {
              valid = false
              let errMsg = 'Some fields is not valid'
              if (res.errors && res.errors.length > 0) {
                errMsg = res.errors[0]
              }
              this.$notify({
                verticalAlign: 'bottom',
                horizontalAlign: 'center',
                type: 'danger',
                message: errMsg,
              })
            }
          })
          .catch((c) => console.log(c))
      })
      if (
        (!this.post.short_description && this.post.short_description < 1) ||
        this.post.short_description.length > 500
      ) {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'Short Description is invalid',
        })
        valid = false
      }
      if (!this.post.long_description && this.post.long_description < 1) {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'Long Description is invalid',
        })
        valid = false
      }

      // if (!this.imgFile && this.mode === 'create') {
      //   this.$notify({
      //     verticalAlign: 'bottom',
      //     horizontalAlign: 'center',
      //     type: 'danger',
      //     message: 'Missing job image',
      //   })
      //   valid = false
      // }

      return valid
    },
    fileChanges(file) {
      this.post.image_thumbnail = URL.createObjectURL(file)
      // this.$emit('imgChange', file)
    },

    removeAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
    },
  },
}
</script>
<style></style>
