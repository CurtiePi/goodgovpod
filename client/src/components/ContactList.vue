<template>
  <div class="container-xl">
    <h1>Contact List</h1>
      <div class="row">
        <!-- div class="col-md-12 col-sm-12 col-xs-12 row inline align-middle" -->
        <div class="d-flex flex-col">
            <div class="p-2">
            <ul class="fancy m-5">
                <li class="fancy">
                    <label for="nameFilter">Name Filter</label>
                    <input type="text" v-model="f_name" @input="filterName()" />
                    <span>Filter on a name</span>
                </li>
            </ul>
            </div>
            <div class="p-1 mt-5">
            <span class="m-5">Message Contacts:&nbsp;</span>
            <ToggleButton
               @toggleChange="toggleSelectBoxes" />
            <span v-if="allowSendMail">
                <button class="btn btn-info ms-5" type="button"
                         @click="createMessage()">
                    Send Mail
                </button>
            </span>
            </div>
        </div>
        <span v-if="errorMsg" class="errorMsg">{{ errorMsg }}</span>
    </div>
  <table class="responsive-table">
    <!-- caption>Top 10 Grossing Animated Films of All Time</caption -->
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Phone</th>
        <th scope="col">Notes</th>
        <th scope="col" v-if="boxActive">
          <label>
            <input type="checkbox" name="select_all" 
              :checked="allSelected"
              @input="selectAll()" /> Select All
          </label> 
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contact in contact_display"
             :key="contact._id">
        <th scope="row">
            <a 
                href="javascript:void(0)"
                @click="linkTo('ContactProfile', {'contactData': JSON.stringify(contact), 'caller': ['Contacts']})">
                {{ contact.fname }}  {{ contact.lname }}
            </a>
        </th>
        <td data-title="Email">
            <a 
                href="javascript:void(0)"
                @click="linkTo('CreateMessage', {'targets': [contact.email], 'caller': ['Contacts'] })">
                {{ contact.email }}
            </a>
        </td>
        <td data-title="Phone">{{ contact.phone }}</td>
        <td data-title="Phone">{{ contact.notes }}</td>
        <td v-if="boxActive"><input type="checkbox" name="selectees" :value="contact.email" 
                v-model="selectees" /></td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import ToggleButton from '@/components/ToggleButton.vue'
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions } from 'pinia'
import { useParameterStore } from '@/stores/ParameterStore'
const paramStore = useParameterStore()

export default {
  name: 'contactList',
  components: { ToggleButton},
  props: [],
  data () {
    return {
      boxActive: false,
      contacts: [],
      contact_display: [],
      f_name: null,
      errorMsg: '',
      selectees: [],
      f_registry: {
        nameFilter: {
          filter: [],
          status: false
        }
      }
    }
  },
  computed: {
    allowSendMail() {
        return this.boxActive && (0 < this.selectees.length)
    },

    allSelected() {
        return this.selectees.length == this.contact_display.length
    }
  },
  methods: {
    ...mapActions(useParameterStore, ["loadPayload", "clearPayload"]),
    getContacts: async function () {
      let response = await AuthenticationService.listContacts()
      
      this.loadContactData(response.data)
    },
    loadContactData: function (data) {
      this.contacts = data
      this.contact_display = data
      this.sortList()
    },
    alphanumericSort: function (a, b) {
      return (a.lname < b.lname) ? -1 : (a.name > b.name) ? 1 : 0
    },
    sortList () {
      let ftn = this.alphanumericSort
      this.contact_display.sort(ftn)
    },
    filterName: function () {
      this.f_registry.nameFilter.filter = this.contacts.filter((value) => { return (`${value.fname} ${value.lname}`).toLowerCase().indexOf(this.f_name.toLowerCase()) !== -1 })
      if (this.f_name !== '') {
        this.f_registry.nameFilter.status = true
      } else {
        this.f_registry.nameFilter.status = false
      }

      this.applyFilters()
    },
    linkTo: function(componentName, payload) {
        paramStore.loadPayload(payload)
        this.$router.replace({name: componentName})
    },
    toggleSelectBoxes(value) {
        this.boxActive = value 
    },
    selectAll: function () {
      let isSelectAll = document.getElementsByName('select_all')[0].checked
      let inputs = document.getElementsByName('selectees')

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = isSelectAll
        if (isSelectAll) {
          if (!this.selectees.includes(inputs[i].value) && inputs[i].value !== '') {
            this.selectees.push(inputs[i].value)
          }
        } else {
          let idx = this.selectees.indexOf(inputs[i].value)
          this.selectees.splice(idx, 1)
        }
      }
    },
    createMessage: function () {
      if (this.selectees.length > 0) {
        let payload = { 'targets': this.selectees,
                         'isBulk': this.selectees.length > 5,
                         'caller': ['Contacts']
                      }

        paramStore.loadPayload(payload)

        this.$router.push({ name: 'CreateMessage' })
      } else {
        this.errorMsg = 'Please select recipients before trying to email your message!'
      }
    },
    applyFilters: function () {
      let filterObj = {}
      let haveEmptyFilter = false
      let hasActiveFilters = false

      for (let key in this.f_registry) {
        let filterLength = this.f_registry[key].filter.length
        if (this.f_registry[key].status && filterLength > 0) {
          filterObj[key] = this.f_registry[key].filter
          hasActiveFilters = true
        } else if (this.f_registry[key].status && filterLength === 0) {
          haveEmptyFilter = true
          hasActiveFilters = true
        }
      }

      if (hasActiveFilters) {
        if (haveEmptyFilter) {
          //this.contact_display = []
          this.contact_display = this.contacts
        } else {
          let result = Object
            .values(filterObj)
            .reduce((a, b) => b.filter(Set.prototype.has, new Set(a)))

          this.contact_display = result
        }
      } else {
        this.contact_display = this.contacts
      }
    }
  },
  mounted () {
    if (paramStore.notEmpty) {
      let payload = paramStore.payload
      this.loadContactData(JSON.parse(payload.contactData))
      paramStore.clearPayload()
    } else {
      this.getContacts()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "bourbon";


/* Styles */
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  font-family: $font-stack-system;
  color: rgba(0,0,0,.87);
}

a {
  color: rgba(64,64,255,1);
  
  &:hover,
  &:focus {
    color: rgba(4,106,56,1); 
  }
}

.errorMsg {
  font-weight: bold;
  color: #FF0000;
  font-size: 12px;
}

ul.fancy {
  list-style: none;
  width: min-content;
  padding: 0;
  margin: 0;
}

li.fancy {
  position:relative;
  display: block;
  padding: 9px;
  border:1px solid #DDDDDD;
  margin-bottom: 30px;
  border-radius: 3px;
}

li.fancy:last-child{
	margin-bottom: 0px;
	text-align: center;
}

li.fancy > label{
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

li.fancy > span{
	background: #0EFEFB;
	display: block;
	padding: 3px;
	margin: 0 -9px -9px -9px;
	text-align: center;
	color: #0000FF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
}

/*  Breakpoints */
$bp-maggie: 15em; 
$bp-lisa: 30em;
$bp-bart: 48em;
$bp-marge: 62em;
$bp-homer: 75em;

/* Styles */
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  font-family: $font-stack-system;
  color: rgba(0,0,0,.87);
}

a {
  color: rgba(64,64,255,1);
  
  &:hover,
  &:focus {
    color: rgba(4,106,56,1); 
  }
}

.container {
  margin: 5% 3%;
  
  @media (min-width: $bp-bart) {
    margin: 2%; 
  }
  
  @media (min-width: $bp-homer) {
    margin: 2em auto;
    max-width: $bp-homer;
  }
}

.responsive-table {
  width: 100%;
  margin-bottom: 1.5em;
  border-spacing: 0;
  
  @media (min-width: $bp-bart) {
    font-size: .9em; 
  }
  
  @media (min-width: $bp-marge) {
    font-size: 1em; 
  }
  
  thead {
    /* Accessibly hide <thead> on narrow viewports */
    position: absolute;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    padding: 0;
    border: 0;
    height: 1px; 
    width: 1px; 
    overflow: hidden;
    
    @media (min-width: $bp-bart) {
      /* Unhide <thead> on wide viewports */
      position: relative;
      clip: auto;
      height: auto;
      width: auto;
      overflow: auto;
    }
    
    th {
      background-color: rgba(170,195,197,1);
      border: 1px solid rgba(134,188,37,1);
      font-weight: normal;
      text-align: center;
      color: brown;
      
      &:first-of-type {
        text-align: left; 
      }
    }
  }
  
  /* Set these items to display: block for narrow viewports */
  tbody,
  tr,
  th,
  td {
    display: block;
    padding: 0;
    text-align: left;
    white-space: normal;
  }
  
  tr {   
    @media (min-width: $bp-bart) {
      /* Undo display: block */ 
      display: table-row; 
    }
  }
  
  th,
  td {
    padding: .5em;
    vertical-align: middle;
    
    @media (min-width: $bp-lisa) {
      padding: .75em .5em; 
    }
    
    @media (min-width: $bp-bart) {
      /* Undo display: block */
      display: table-cell;
      padding: .5em;
    }
    
    @media (min-width: $bp-marge) {
      padding: .75em .5em; 
    }
    
    @media (min-width: $bp-homer) {
      padding: .75em; 
    }
  }
  
  caption {
    margin-bottom: 1em;
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    
    @media (min-width: $bp-bart) {
      font-size: 1.5em;
    }
  }
  
  tfoot {
    font-size: .8em;
    font-style: italic;
    
    @media (min-width: $bp-marge) {
      font-size: .9em;
    }
  }
  
  tbody {
    @media (min-width: $bp-bart) {
      /* Undo display: block  */
      display: table-row-group; 
    }
    
    tr {
      margin-bottom: 1em;
      
      @media (min-width: $bp-bart) {
        /* Undo display: block  */
        display: table-row;
        border-width: 1px;
      }
      
      &:last-of-type {
        margin-bottom: 0; 
      }
/*      
      &:nth-of-type(even) {
        @media (min-width: $bp-bart) {
          background-color: rgba(0,0,0,.12);
        }
      }
*/
    }
    
    th[scope="row"] {
      background-color: rgba(170,195,197,1);
      color: yellow;
      
      @media (min-width: $bp-lisa) {
        border-left: 1px solid rgba(134,188,37,1);
        border-bottom: 1px solid rgba(134,188,37,1);
      }
      
      @media (min-width: $bp-bart) {
        background-color: transparent;
        color: rgba(0,0,0.87);
        text-align: left;
      }
    }
    
    td {
      text-align: right;
      
      @media (min-width: $bp-bart) {
        border-left: 1px solid rgba(134,188,37,1);
        border-bottom: 1px solid rgba(134,188,37,1);
        text-align: center; 
      }

      &:last-of-type {
        @media (min-width: $bp-bart) {
          border-right: 1px solid rgba(134,188,37,1);
        } 
      }
    }
    
    td[data-type=currency] {
      text-align: right; 
    }
    
    td[data-title]:before {
      content: attr(data-title);
      float: left;
      font-size: .8em;
      color: rgba(0,0,0,.54);
      
      @media (min-width: $bp-lisa) {
        font-size: .9em; 
      }
      
      @media (min-width: $bp-bart) {
        /* Don’t show data-title labels */
        content: none; 
      }
    } 
  }
}
</style>
