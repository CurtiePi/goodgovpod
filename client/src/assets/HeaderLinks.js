export default [ 
        {
          text: 'Contact',
          icon: 'fa-solid fa-person',
          subNavLinks: [
            {
              text: 'Contact List',
              name: 'Contacts',
              icon: 'fa-solid fa-people-group',
            },
            {
              text: 'Message Contacts',
              name: 'SelectContacts',
              icon: 'fa-solid fa-message'
            },
            {
              text: 'Add Contact',
              name: 'ContactAdd',
              icon: 'fa-solid fa-person-circle-plus',
              param: {
                name: 'singleOp',
                value: true
              }
            },
          ]
        }
      ]
