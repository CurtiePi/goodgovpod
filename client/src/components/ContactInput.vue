<template>
  <section>
    <div class="left-panel">
      <span class="header mx-4 mt-5 p-5">{{ headerText }}</span>
    </div>
    <div class="right-panel">
      <form class="form-style-7">
        <div class="row col-md-12">
          <div class="col-md-5 offset-md-1">
            <ul>
              <li> 
                <label for="name">First Name</label>
                <input type="text" name="fname" maxlength="100"
                  v-model.trim="contactFields.fname" />
                <span>Enter first name here</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1">
            <ul>
              <li> 
                <label for="name">Last Name</label>
                <input type="text" name="lname" maxlength="100"
                   v-model.trim="contactFields.lname" />
                <span>Enter last name here</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="phone">Phone</label>
                <input type="text" name="phone" maxlength="100"
                   v-model="contactFields.phone" />
                <span>Enter a phone number</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="email">Email</label>
                <input type="email" name="email" maxlength="100"
                   v-model.trim="contactFields.email" />
                <span>Enter a valid email address</span>
              </li>
            </ul>
          </div>
          <div class="col-md-10 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="notes">Contact Notes</label>
                <textarea cols="60" name="notes"
                   @keyup="adjustTextarea"
                   ref="bio"
                   v-model="contactFields.notes" />
                <span>Enter notes about the contact</span>
              </li>
            </ul>
          </div>
          <div class="d-inline mt-2">
            <button type="button" class="btn btn-primary"
              @click="isEditing ? updateContact() : createContact()"
              :disabled="!allowSubmitForm">{{ headerText }}</button>
            <button type="button" class="btn btn-primary"
              @click="cancel()">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions } from 'pinia'
import { useParameterStore } from '@/stores/ParameterStore'
const paramStore = useParameterStore()

export default {
  name: 'contactForm',
  props: [],
  data () {
    return {
      callerName: [],
      contact: null,
      isEditing: false,
      form: {},
      origContactFields: {},
      contactFields: {
        fname: null,
        lname: null,
        phone: null,
        email: null,
        notes: null
      }
    }
  },
  computed: {
    allowSubmitForm: function () {
      return Object.values(this.contactFields).some(this.hasValue)
    },
    headerText: function () {
      return this.isEditing ? 'Edit Contact' : 'Add Contact'
    }
  },
  methods: {
    ...mapActions(useParameterStore, ["loadPayload", "clearPayload"]),
    adjustTextarea () {
      this.$refs.bio.style.height = "20px"
      this.$refs.bio.style.height = (this.$refs.bio.scrollHeight) + "px"
    }, 
    checkForChanges () {
      var changeLog = {}
      for (var key in this.contactFields) {
          if (this.origContactFields[key] !== this.contactFields[key]) {
            changeLog[key] = (this.contactFields[key].constructor === String) ? this.contactFields[key].trim() : this.contactFields[key]
          }
      }
      // console.log(changeLog)
      return changeLog
    },
    cancel () {
      if (this.isEditing) {
        let caller = this.callerName.shift()

        let payload = {'contactData': JSON.stringify(this.contact),
                       'caller': this.callerName
                      }

        paramStore.loadPayload(payload)

        this.$router.replace({ name: caller })
      } else {
        this.$router.replace({name: 'Contacts'})
      }
    },
    checkoutput () {
      let data = {}

      for (var key in this.contactFields) {
        var inputValue = this.contactFields[key]
        if (inputValue) {
            data[key] = inputValue
        }
      }

      let payload = data
      console.log(payload)
    },
    async updateContact () {
      let data = this.checkForChanges()

      if (Object.keys(data).length) {
        let payload = {
          criteria: {'_id': this.contact._id},
          update: data}

        var response = await AuthenticationService.updateContact(payload)
        this.contact = response.data
        this.clearInputs()

        let caller = this.callerName.shift()

        payload = { 'contactData': JSON.stringify(this.contact),
                    'caller': this.callerName
                  }

        paramStore.loadPayload(payload)
        
        this.$router.replace({ name: caller})
      } else {
        var message = 'No values have been changed!\nChange a value before updating or Cancel'
        let options = {
          okText: 'Understood',
          animation: 'fade'
        }

        this.$dialog
          .alert(message, options)
          .then(function () {
            console.log('Cancelling!')
          })
      }
    },
    async createContact () {
      let data = {}

      for (var key in this.contactFields) {
        var value = this.contactFields[key]
        if (value) {
          data[key] = (value.constructor === String) ? value.trim() : value
        }
      }

      let payload = data
      this.clearInputs()

      var response = await AuthenticationService.createContact(payload)
      this.contact = response.data
      console.log("Going to contact list.")
      this.$router.replace({ name: 'Contacts' })
    },
    hasValue (value) {
      return value != null &&
        value !== undefined &&
        value !== ''
    },
    async loadInputs () {
      if (this.isEditing) {
        for (var key in this.contactFields) {
          this.contactFields[key] = this.contact[key]
          this.origContactFields[key] = this.contact[key]
        }
      }
    },
    clearInputs () {
      for (var key in this.contactFields) {
        this.contactFields[key] = null
      }
    }
  },
  mounted () {
    if (paramStore.notEmpty) {
      let payload = paramStore.payload
      this.isEditing = true
      this.contact = JSON.parse(payload.contactData)
      this.callerName = payload.caller
      paramStore.clearPayload()
      this.loadInputs()
    }
  }
}
</script>
<style scoped>

button {
    margin: 5px 10px;
}

.form-style-7{
	max-width:800px;
	margin:5px;
	background:#fff;
	border-radius:2px;
	padding:20px;
	font-family: Georgia, "Times New Roman", Times, serif;
}
.form-style-7 div {
	margin-top:5px;
	margin-bottom:35px;
}
.form-style-7 h1{
	display: block;
	text-align: center;
	padding: 0;
	margin: 0px 0px 20px 0px;
	color: #5C5C5C;
	font-size:x-large;
}
.form-style-7 ul{
	list-style:none;
	padding:0;
	margin:0;	
}
.form-style-7 li {
    position:relative;
	display: block;
	padding: 9px;
	border:1px solid #DDDDDD;
	margin-bottom: 30px;
	border-radius: 3px;
}
.form-style-7 li:last-child{
	margin-bottom: 0px;
	text-align: center;
}
.form-style-7 li > label{
	display: block;
	float: left;
	margin-top: -30px;
	background: #FFFFFF;
	height: 19px;
	padding: 2px 5px 2px 5px;
	color: #0E6EFB;
	font-size: 14px;
	overflow: hidden;
	font-family: Arial, Helvetica, sans-serif;
}
.form-style-7 input[type="text"],
.form-style-7 input[type="date"],
.form-style-7 input[type="datetime"],
.form-style-7 input[type="email"],
.form-style-7 input[type="number"],
.form-style-7 input[type="search"],
.form-style-7 input[type="time"],
.form-style-7 input[type="url"],
.form-style-7 input[type="password"],
.form-style-7 textarea,
.form-style-7 select 
{
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	width: 100%;
	display: block;
	outline: none;
	border: none;
	height: 25px;
	line-height: 25px;
	font-size: 16px;
	padding: 0;
	font-family: Georgia, "Times New Roman", Times, serif;
}
.form-style-7 input[type="text"]:focus,
.form-style-7 input[type="date"]:focus,
.form-style-7 input[type="datetime"]:focus,
.form-style-7 input[type="email"]:focus,
.form-style-7 input[type="number"]:focus,
.form-style-7 input[type="search"]:focus,
.form-style-7 input[type="time"]:focus,
.form-style-7 input[type="url"]:focus,
.form-style-7 input[type="password"]:focus,
.form-style-7 textarea:focus,
.form-style-7 select:focus 
{
}
.form-style-7 li > span{
	background: #0EFEFB;
	display: block;
	padding: 3px;
	margin: 0 -9px -9px -9px;
	text-align: center;
	color: #0000FF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
}
.form-style-7 textarea{
	resize:none;
}
.form-style-7 input[type="submit"],
.form-style-7 input[type="button"]{
	background: #2471FF;
	border: none;
	padding: 10px 20px 10px 20px;
	border-bottom: 3px solid #5994FF;
	border-radius: 3px;
	color: #D2E2FF;
}
.form-style-7 input[type="submit"]:hover,
.form-style-7 input[type="button"]:hover{
	background: #6B9FFF;
	color:#fff;
}


.left-panel{
  position: fixed;
  float: left;
  height: 100vh;
  overflow:hidden;
  background: linear-gradient(to right, transparent 50%, #fff 50%), url('~@/assets/good_governance.jpg') no-repeat center;
 background-size: cover;
 width: 60%;
}

.right-panel {
  position: absolute;
  left: 35%;
  height: 100vh;
  max-width:100vw;
  width:70%;
  overflow-x: hidden;
}

.header {
  position: relative;
  top: 55%;
  float: left; 
  font-size: 3em;
  font-weight: bold;
}
</style>
