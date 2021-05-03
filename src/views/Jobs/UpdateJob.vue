<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
    </base-header>

    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="12">
          <card>
            <b-row align-v="center" slot="header">
              <b-col>
                <h3 class="mb-0">Update Post</h3>
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
                    <input
                      type="file"
                      name="profile_pic"
                      id="file"
                      ref="file"
                      v-on:change="handleFileUpload()"
                    />

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
                Update
              </base-button>
            </b-form>
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import JobDetail from './component/JobDetail'
import imageService from '@/api/imageService'
import postService from '@/api/postService'

export default {
  components: { JobDetail },
  data() {
    return {
      post: {
        id: 0,
        title: '',
        short_description: '',
        long_description: '',
      },
      imageFile: null,
      submitting: false,
      isLoading: false,
      file: '',
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
      let res = await postService.getPostById(id)
      if (res && res.success) {
        this.post = res.post
        console.log(res.post);
      }
    },
    onSubmit() {
      let formData = new FormData()
      formData.append('profile_pic', this.file)
      formData.append('title', this.post.title)
      formData.append('short_description', this.post.short_description)
      formData.append('long_description', this.post.long_description)
      this.post.seoTitle = this.removeAccents(this.post.title)
      formData.append('seoTitle', this.post.seoTitle)
      if (this.validate()) {
        postService
          .updatePostById(formData, this.$route.params.id)
          .then((result) => {
            if (result && result.success) {
              this.$notify({
                verticalAlign: 'bottom',
                horizontalAlign: 'center',
                type: 'success',
                message: 'Update success',
              })
            }
          })
          .catch((err) => {
            this.$notify({
              verticalAlign: 'bottom',
              horizontalAlign: 'center',
              type: 'danger',
              message: err.message,
            })
          })
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
      if (!this.file && this.file.length < 1) {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'Image is invalid',
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
