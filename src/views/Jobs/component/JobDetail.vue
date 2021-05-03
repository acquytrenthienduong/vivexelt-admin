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
                  <base-textarea
                    type="text"
                    label="Long Description"
                    placeholder="Long Description"
                    v-model="post.long_description"
                    name="Long Description"
                    ref="Long Description"
                    :rules="{ required: true, max: 1000 }"
                  >
                  </base-textarea>
                </b-col>
              </b-row>
            </div>

            <div class="pl-lg-4">
              <b-row>
                <b-col lg="8">
                  <img :src="post.image_thumbnail" width="200px" />
                  <b-row>
                    <b-col>
                      <b-form-file
                        @input="fileChanges"
                        v-model="imgFile"
                        placeholder="Select file"
                        drop-placeholder="Drop file here..."
                        accept="image/jpeg, image/png"
                        class="button"
                      ></b-form-file>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>

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
import { MapMinimumDegree, MapJobType, MinimumDegree, JobType } from '../constant/constant'
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
          imgFile: null,
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
      file: '',
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
    onSubmit() {
      let formData = new FormData()
      formData.append('profile_pic', this.imgFile)
      formData.append('title', this.post.title)
      formData.append('short_description', this.post.short_description)
      formData.append('long_description', this.post.long_description)
      this.post.seoTitle = this.removeAccents(this.post.title)
      formData.append('seoTitle', this.post.seoTitle)

      if (this.validate() && this.mode === 'create') {
        let res = postService.createPost(formData)
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'success',
          message: 'Create success',
        })
        this.$router.push({ name: 'jobs' })
      }
    },
    validate() {
      let valid = true
      if (!this.post.title && this.post.title.length < 1) {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'Title is invalid',
        })
        valid = false
      }
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

      return valid
    },
    fileChanges(file) {
      this.post.image_thumbnail = URL.createObjectURL(file)
      this.$emit('imgChange', file)
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0]
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
