<template>
  <b-container fluid class="mt--6">
    <b-row>
      <!-- Job Detail -->
      <b-col xl="8">
        <card>
          <b-row align-v="center" slot="header">
            <b-col>
              <h3 class="mb-0">{{ title }}</h3>
            </b-col>
            <base-button type="primary" :disabled="isLoading" @click="generateDefaultData"
              >Test</base-button
            >
          </b-row>

          <b-form @submit.prevent="submit">
            <div class="pl-lg-4">
              <b-row>
                <b-col lg="12">
                  <base-input
                    type="text"
                    label="Name"
                    placeholder="Name"
                    v-model="job.name"
                    name="Name"
                    ref="name"
                    :rules="{ required: true, min: 10 }"
                  >
                  </base-input>
                </b-col>
                <b-col lg="12">
                  <base-textarea
                    label="Short description"
                    placeholder="A few words about job ..."
                    v-model="job.short_description"
                    name="Short Description"
                    ref="shortdes"
                    :rules="{ required: true, min: 10 }"
                  >
                  </base-textarea>
                </b-col>
              </b-row>
              <div>
                <label class="form-control-label">Time Opening</label>
                <b-row>
                  <b-col lg="6" class="form-group">
                    <flat-picker
                      :config="datePickerConfig"
                      class="form-control datepicker"
                      v-model="job.open_at"
                      @on-change="onOpenAtOnChange"
                    >
                    </flat-picker>
                  </b-col>
                  <b-col lg="6">
                    <flat-picker
                      :config="closeAtConfiguration"
                      class="form-control datepicker"
                      v-model="job.close_at"
                    >
                    </flat-picker>
                  </b-col>
                  <b-col> </b-col>
                </b-row>
              </div>

              <b-row>
                <b-col>
                  <base-input
                    type="text"
                    label="Industry"
                    placeholder="Industry"
                    v-model="job.industry"
                    name="Industry"
                    ref="industry"
                    :rules="{ required: true, min: 10 }"
                  >
                  </base-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <base-input
                    type="text"
                    label="Reviewed Url"
                    placeholder="Reviewed Url"
                    v-model="job.reviewed_link"
                    name="Reviewed Url"
                    ref="reviewUrl"
                    :rules="{ required: true, url_rule: true }"
                  >
                  </base-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="form-group">
                  <base-input
                    type="text"
                    label="Application Url"
                    placeholder="Application Url"
                    v-model="job.application_link"
                    name="Application Url"
                    ref="applicationUrl"
                    :rules="{ required: true, url_rule: true }"
                  >
                  </base-input>
                </b-col>
              </b-row>
            </div>
            <hr class="my-4" />

            <!-- Address -->
            <h6 class="heading-small text-muted mb-4">Long description</h6>
            <dpmx-editor
              :value="job.long_description"
              v-model="job.long_description"
              :height="500"
            />
            <!-- Description -->
            <hr class="my-4" />
            <base-button type="primary" :disabled="submitting" :loading="submitting" native-type="submit" class="my-4">
              {{ btnSubmitTitle }}
            </base-button>
          </b-form>
        </card>
      </b-col>
      <!-- Job Image -->
      <b-col xl="4" class="order-xl-2 mb-5">
        <b-card no-body class="card-profile mb-15" alt="Image placeholder" img-top>
          <img :src="job.image_url" alt="Image placeholder" class="card-img-top " />
          <b-card-body>
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
          </b-card-body>
        </b-card>
        <b-card no-body class="card-profile">
          <b-card-body>
            <b-row>
              <b-col class="form-group">
                <label class="mr-sm-2" for="inline-form-custom-select-pref">Minimum Degree</label>
                <dpmx-select
                  v-model="job.min_degree"
                  :options="getMinimumDegrees"
                  label="name"
                  trackBy="value"
                  valueKey="value"
                  placeholder="Select Minimum Degree"
                  :defaultValue="{ value: 'uni_undergraduate', name: 'University Undergraduate' }"
                  :allowEmpty="false"
                ></dpmx-select>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="form-group">
                <label class="mr-sm-2" for="inline-form-custom-select-pref">Country</label>
                <dpmx-select
                  v-model="job.country_code"
                  :options="countries"
                  label="country_name"
                  valueKey="code"
                  trackBy="code"
                  placeholder="Select Country"
                  :defaultValue="{ code: 'VN', country_name: 'VietNam' }"
                  :allowEmpty="false"
                ></dpmx-select>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="form-group">
                <label class="mr-sm-2" for="inline-form-custom-select-pref">Type</label>
                <dpmx-select
                  v-model="job.type"
                  :options="getJobTypes"
                  label="name"
                  valueKey="value"
                  placeholder="Select Type"
                  :defaultValue="{ code: 'graduated', name: 'Graduate Jobs' }"
                  :allowEmpty="false"
                ></dpmx-select>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div style="display: flex;flex-direction:row;">
                  <label class="mr-sm-2" style="flex:3;" for="inline-form-custom-select-pref"
                    >Published</label
                  >
                  <dpmx-toggle-button
                    v-model="job.published"
                    style="float:right;"
                    :value="job.published"
                  />
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/themes/material_green.css'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
import {
  MapMinimumDegree,
  MapJobType,
  MapJobStatus,
  JobStatus,
  MinimumDegree,
  JobType,
} from '../constant/constant'
import countryService from '@/api/countryService'
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  components: { flatPicker },
  name: 'job-detail',
  props: {
    job: {
      type: Object,
      default: () => {
        return {
          id: 0,
          name: '',
          short_description: '',
          long_description: '',
          country_code: '',
          min_degree: '',
          industry: '',
          type: '',
          application_link: '',
          reviewed_link: '',
          open_at: new Date(),
          close_at: '',
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
    }
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
      return this.mode === 'create' ? 'Create Job' : 'Update Job'
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
      await this.getAllCountries()
    },
    submit() {
      if (this.validate()) {
        console.log('valid')
        this.$emit('formSubmit')
      }
      return
    },
    validate() {
      let refs = this.$refs
      let valid = true
      //this.formValid = true
      //this.firstInvalidElementId = ''
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
      if (!this.job.long_description && this.job.long_description < 1) {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'Long Description is invalid',
        })
        valid = false
      }

      if (!this.imgFile && this.mode === 'create') {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'Missing job image',
        })
        valid = false
      }
      let open_at = new Date(this.job.open_at.toString()).getTime()
      let close_at = new Date(this.job.close_at.toString()).getTime()
      if (open_at >= close_at) {
        this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: 'The Close Date is before The Open Date.',
        })
        valid = false
      }
      return valid
    },
    async getAllCountries() {
      let res = await countryService.getAllCountry()
      if (!res || !res.countries) {
        // toast
      }
      this.countries = res.countries
    },
    fileChanges(file) {
      this.job.image_url = URL.createObjectURL(file)
      this.$emit('imgChange', file)
    },
    onOpenAtOnChange(selectedDates, dateStr, instance) {
      let selectedDate = new Date(dateStr)
      let newMinCloseDate = new Date(selectedDate.setDate(selectedDate.getDate() + 1))
      let closeDate = new Date(this.job.close_at)
      if (this.job.close_at === '' || newMinCloseDate.getTime() > closeDate.getTime()) {
        this.job.close_at = newMinCloseDate
      }
    },
    generateDefaultData() {
      this.job = Object.assign(this.job, {
        name: 'Default name',
        short_description: 'this is the short description',
        long_description: 'this is the long description',
        industry: 'some industry',
        application_link: 'google.comm',
        reviewed_link: 'google.com',
      })
    },
  },
}
</script>
<style></style>
