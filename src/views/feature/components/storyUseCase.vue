<template>
   <div>
    <h1>Dynamic Form Rendering</h1>
    <form @submit.prevent="submitForm">
      <div v-for="field in categorizedFields" :key="field.customFieldId">
        <label :for="field.fieldNameEn">{{ field.fieldNameCn }}:</label>
        <template v-if="field.fieldType === 'text' || field.fieldType === 'memo'">
          <input v-if="field.fieldType === 'text'" type="text" :maxlength="field.length" :required="field.mandatory === 1" v-model="field.inputValue">
          <textarea v-else :maxlength="field.length" :required="field.mandatory === 1" v-model="field.inputValue"></textarea>
        </template>
        <template v-else-if="field.fieldType === 'dropDown' || field.fieldType === 'linkedDropDown' || field.fieldType === 'number' || field.fieldType === 'multiList' || field.fieldType === 'userList'">
          <select :required="field.mandatory === 1" v-model="field.selectedValue">
            <option v-for="(value, label) in parsePossibleValues(field.possibleValue)" :key="value" :value="value">{{ label }}</option>
          </select>
        </template>
        <template v-else-if="field.fieldType === 'radio' || field.fieldType === 'checkbox'">
          <input :type="field.fieldType" :required="field.mandatory === 1" :checked="field.defaultValue === '1'" v-model="field.checked">
        </template>
        <template v-else-if="field.fieldType === 'Date'">
          <input type="date" :required="field.mandatory === 1" v-model="field.dateValue">
        </template>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
  </template>
  

  <script>
  import { getAllCustomField } from '@/api/getFields'

  export default {
    data() {
      return {
        allFields: []
      };
    },
    mounted() {
      // Make the API call when the component is mounted
      console.log("this is stroyUserCasePage")
      this.getAllCustomField();
    },
    computed: {
        projectInfo() {
      return this.$store.state.user.userinfo
    },
      
    categorizedFields() {
      const categorized = {
        textFields: [],
        dropdownFields: [],
        radioFields: [],
        checkboxFields: [],
        dateFields: []
      };
    this.allFields.forEach((field) => {
        switch (field.fieldType) {
          case 'text':
          case 'memo':
            categorized.textFields.push({ ...field, inputValue: field.defaultValue || '' });
            break;
          case 'dropDown':
          case 'linkedDropDown':
          case 'number':
          case 'multiList':
          case 'userList':
            categorized.dropdownFields.push({ ...field, selectedValue: field.defaultValue || '' });
            break;
          case 'radio':
            categorized.radioFields.push({ ...field, checked: field.defaultValue === '1' });
            break;
          case 'checkbox':
            categorized.checkboxFields.push({ ...field, checked: field.defaultValue === '1' });
            break;
          case 'Date':
            categorized.dateFields.push({ ...field, dateValue: field.defaultValue || '' });
            break;
        }
      });
      return categorized;
    }
  },
      
    methods: {
        async getAllCustomField() {
      try {
        const response = await getAllCustomField({
          projectId: this.projectInfo.userUseOpenProject.projectId,
          scopeId: '2000002'
        });

        if (response.code === '200') {
          const data = response.data; // Assuming data contains the fetched fields
          // Log the fetched data for verification
          console.log('Fetched Fields:', data);
          // Assign the fetched fields to a variable or data property in your Vue component
          this.allFields = data;
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
},
submitForm() {
      // Handle form submission here
      // Access form values from categorizedFields
      console.log(this.categorizedFields);
    },

    parsePossibleValues(possibleValue) {
      // Implement your logic to parse possible values
      // Return an object or array that can be iterated in the template
      // This function is not defined in the provided code snippet
    }
  },
}
  </script>
  