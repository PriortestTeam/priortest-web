<template>
    <div>
    <el-form :model="form" label-width="120px">
      <div v-for="field in sysCustomFields" :key="field.customFieldId">

        <el-form-item :label="generateLabel(field)">

      <!--  <span v-if="field.mandatory" style="color: red; margin-right: 2px;">*</span>
        <el-form-item :label="field.fieldNameCn" :prop="field.label"> -->
            
            

          <template  v-if="['text', 'link'].includes(field.fieldType)">
            <el-input
              v-model="form[createUniqueLabel(field)]"
              :placeholder="field.fieldNameCn"
              :maxlength="field.length"
              type="text"
            />
          </template>
          <template v-else-if="field.fieldType === 'memo'">
            <el-input
              v-model="form[createUniqueLabel(field)]"
              :placeholder="field.fieldNameCn"
              :maxlength="field.length"
              type="textarea"
              :rows="4"
            />
          </template>
          


          <template v-else-if="['userList', 'dropDown', 'number'].includes(field.fieldType)">
  <el-select v-model="form[createUniqueLabel(field)]" placeholder="Select">
    <el-option
      v-for="option in parseOptions(field.possibleValue)"
      :key="option.value"
      :label="option.label"
      :value="option.value"
      type="dropDown"
    />
  </el-select>
</template>


          <template v-else-if="field.fieldType === 'checkbox'">
            <el-checkbox v-model="form[createUniqueLabel(field)]" />
          </template>
          <template v-else-if="field.fieldType === 'radio'">
            <el-radio-group v-model="form[createUniqueLabel(field)]">
              <el-radio :label="1">Yes</el-radio>
              <el-radio :label="0">No</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </div>
  
        <div v-for="field in customFields" :key="field.customFieldId">
          <el-form-item :label="field.fieldNameCn" :prop="field.label">
            <template v-if="field.mandatory">
              <span style="color: red; margin-right: 0px;">*</span>
            </template>
            <template v-if="['text', 'link'].includes(field.fieldType)">
              <el-input
              v-model="form[field.label + '_' + field.fieldType]"
                :placeholder="field.fieldNameCn"
                :maxlength="field.length"               
                type="text"    
                value=field.defaultValue            
              />
             
            </template>
            <template v-else-if="field.fieldType === 'memo'">
              <el-input
              v-model="form[field.label + '_' + field.fieldType]"
                :placeholder="field.fieldNameCn"
                :maxlength="field.length"
                type="textarea"
                :rows="4"
              />
            </template>
            <template v-else-if="['userList', 'dropDown','number'].includes(field.fieldType)">
              <el-select  v-model="form[field.label + '_' + field.fieldType]" placeholder="Select">
                <el-option
                  v-for="option in parseOptions(field.possibleValue)"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  type="dropDown"
                />
              </el-select>
            </template>
            <template v-else-if="field.fieldType === 'checkbox'">
        <el-checkbox 
          :checked="field.default === 1 ? true : false"
          @change="updateCheckboxValue(field.label, field.fieldType)"
        />
      </template>
            <template v-else-if="field.fieldType === 'radio'">
              <el-radio-group v-model="form[field.label + '_' + field.fieldType]">
                <el-radio :label="1">Yes</el-radio>
                <el-radio :label="0">No</el-radio>
              </el-radio-group>
            </template>
         
         <template v-if="field.fieldType === 'multiList'">
         <el-select
          v-model="form[field.label + '_' + field.fieldType]"
          placeholder="Select"
          multiple   
        >
          <el-option
            v-for="option in parseOptions(field.possibleValue)"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>

      <template v-if="field.fieldType === 'Date'">
        <el-date-picker
          v-model="form[field.label + '_' + field.fieldType]"
          :picker-options="datePickerOptions"
          type="date"
          placeholder="Select date"
        ></el-date-picker>
      </template>

    </el-form-item>
        </div>
  
       <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
      </el-form-item>
    </el-form>
    </div>
  </template>
  
  <script>
  import { getAllCustomField } from '@/api/getFields'; // Replace with your actual import path
  
  export default {
    data() {
    return {
      sysCustomFields: [],
      customFields: [],
      form: {}, // Each field in the form should have a unique property
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now(); // Disable dates before the current time
        },
      },
    };
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo;
    },
  },
  methods: { 

    generateLabel(field) {
        const mandatory = field.mandatory ? '*' : '';
        return '${mandatory}${field.fieldNameCn}';
    },
    
    createUniqueLabel(field) {
        return `${field.label}_${field.fieldType}_${field.customFieldId}`; 
},
  
    updateCheckboxValue(label, fieldType) {
      // Set the form field based on checkbox change
      this.$set(this.form, label + '_' + fieldType, !this.form[label + '_' + fieldType]);
    },
    submitForm() {
      console.log('Form submitted:', this.form);
    },
    getData() {
      const projectId = this.projectInfo.userUseOpenProject.projectId;
      const scopeId = '2000002';

      getAllCustomField({ projectId, scopeId })
        .then((res) => {
          if (res.code === '200') {
            const data = res.data;

            this.sysCustomFields = data.filter((item) => item.type === 'sField');
            this.customFields = data.filter((item) => item.type === 'custom');

            this.initializeForm();
          } else {
            console.error('Error fetching custom fields:', res.msg);
          }
        })
        .catch((error) => {
          console.error('Error fetching custom fields:', error);
        });
    },
    initializeForm() {
     

    this.sysCustomFields.forEach((field) => {
    const uniqueLabel = this.createUniqueLabel(field);
    this.$set(this.form, uniqueLabel, '');
  });


      this.customFields.forEach((field) => {
        // Each field in the form should have a unique property
        const uniqueLabel = field.label + '_' + field.fieldType; // Append fieldType to label
        this.$set(this.form, uniqueLabel, ''); // Set each field with its 
      });
    },
      parseOptions(possibleValue) {
        let options = [];
        try {
          const parsedOptions = JSON.parse(possibleValue);
          options = Object.values(parsedOptions).map((value) => ({
            value,
            label: value,
          }));
        } catch (error) {
          console.error('Error parsing possibleValue:', error);
        }
        return options;
      },
    },
    created() {
      this.getData();
    },
  };
  </script>
  
  <style>
  /* Add custom styles if needed */
  </style>
  