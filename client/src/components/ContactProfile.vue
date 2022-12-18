<template>
  <div class="container">
    <div v-if="isFetching" class="col-md-12">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <p>Loading . . .</p>
    </div>
    <div v-else class="card">
      <h2>{{ contact_data.fname }} {{ contact_data.lname }}</h2>
      <br />
      <p><i class="fa fa-phone"></i>{{ contact_data.phone }}</p>
      <p><i class="fa fa-envelope"></i>
      <a 
        href="javascript:void(0)"
        @click="linkTo('CreateMessage', {'targets': [contact_data.email], 'caller': ['ContactProfile', ...callerName], 'contactData': JSON.stringify(contact_data) })">
          {{ contact_data.email }}
      </a>
      </p>
      <hr />
      <div class="row col-md 12">
        <div class="col-md-4">
          <i class="fa fa-clipboard"></i>
          <br/>
          <span class="cust-notes">{{ contact_data.notes }}</span>
        </div>
      </div>
      <hr />
      <div class="row buttons">
        <button class="edit_btn" @click="timeToEdit()">Edit</button>
        <button class="delete_btn" @click="deleteContact()">Delete</button>
        <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
        <button @click="goBack()">Back</button>
      </div>
    </div>     
  </div>     
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import { mapActions } from 'pinia'
import { useParameterStore } from '@/stores/ParameterStore'
const paramStore = useParameterStore()

export default {
  name: 'contactProfile',
  components: { ConfirmDialogue },
  props: [],
  data () {
    return {
      contact_data: null,
      isEditing: false,
      callerName: [],
      isFetching: true 
    }
  },
  methods: {
  ...mapActions(useParameterStore, ["loadPayload", "clearPayload"]),
    timeToEdit () {
      let payload = { 'contactData': JSON.stringify(this.contact_data),
                      'caller': ['ContactProfile', ...this.callerName ]
                    }

      paramStore.loadPayload(payload)
      this.$router.replace({ name: 'ContactEdit' })
    },
    hasValue (inputField) {
      return inputField.value != null &&
        inputField.value !== undefined &&
        inputField.value !== ''
    },
    linkTo: function(componentName, payload) {
        paramStore.loadPayload(payload)
        this.$router.replace({name: componentName})
    },
    async deleteContact () {
      let name = `${this.contact_data.fname} ${this.contact_data.lname}`

      let options = {
        title: `Delete Contact ${name}`,
        okButton: 'I\'m Sure! Delete!',
        cancelButton: 'Cancel',
        message: `Deleting contact ${name} will delete all of their information!<p><strong>This action cannot be undone! Are you sure?</strong></p>`,
        verification: 'delete'
      }

      const ok = await this.$refs.confirmDialogue.show(options)

      if (ok) {

        let payload = {
          'contact': this.contact_data
        }

        let response = await AuthenticationService.deleteContact(payload)

        if (response.status === 200) {
          this.goBack()
        } else {
          console.log(`Response: ${response.message}`)
        }

      } else {
        console.log('You have chosen not to delete this contact!!')
      }
    },
    goBack () {
      let caller = this.callerName.shift()

      if (['Contacts'].includes(caller)) {
        this.$router.replace({name: caller})
      } else {
        let payload = { 'contactData': JSON.stringify(this.contact),
                        'caller': this.callerName
                      }
        
        paramStore.loadPayload(payload)
        this.$router.replace({ name: caller })
      }
    }
  },
  mounted () {
    if (paramStore.notEmpty) {
      let payload = paramStore.payload
      this.contact_data = JSON.parse(payload.contactData)
      this.callerName = payload.caller
      
      paramStore.clearPayload()
    }
    this.isFetching = false
  }

}
</script>
<style scoped>

@media (min-width: 36em) {
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    width: 80%;
    margin: auto;
    text-align: center;
    flex-direction: column;
    background-color: #F5F5DC;
    text-align: left;
    line-height: .9em;
    border: 1px gray solid;
    border-radius: 10px;
    -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    padding: 5px;
    font-size: 0.5em;
  }

  .sector {
    width: 100%;
    margin: 0 auto;
    flex-direction: column;
    padding: 3px;
  }

}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 80%;
  margin: auto;
  margin-top: 10%;
  background-color: #F5F5DC;
  text-align: left;
  line-height: .9em;
  border: 1px gray solid;
  border-radius: 10px;
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  max-width: 900px;
  padding: 5px;
  font-size: 1.5em;
}

.cust-notes {
    white-space: pre-wrap;
    margin-top: 5 px;
    font-size: 1.2em;
}

i {
 margin-right: 5px;
}


hr.solid {
  border-top: 3px solid #bbb;
  width: 80%;
  margin: auto;
}

button {
  margin: 5px 5px;
  border-radius: 25px;
  font-weight: bold;
  width: fit-content;
}

.buttons {
    margin: auto;
}

.edit_btn {
  background: #ffff00;
}

.create_btn {
  background: #36b0ea;
}

.request_btn {
  background: #b936ea;
}

.delete_btn {
  background: #ff0000;
}

button:hover, a:hover {
  opacity: 0.7;
}

</style>
