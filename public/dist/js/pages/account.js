//Account 
var account_data = []
var default_account = {
  first_name: "",
  last_name: "",
  contact_no:"",
  contact_person: "",
  street: "", 
  city : "",
  state: "",
  zip: "",
  role: "",
  day: 0,
  month: 0,
  year: 0,
  active: true,
  email: "",
  password: "" 
}
var accountTableId = "#accountTable"
var accountModelId = "#account-modal"
var accountModalTitle = "#account-modal-title"
var accountFirstName = "#account_first_name"
var accountLastName = "#account_last_name"
var accountContactNo = "#account_contact_no"
var accountContactPerson = "#account_contact_person"
var accountStreet = "#account_street"
var accountCity = "#account_city" 
var accountState = "#account_state"
var accountZip = "#account_zip"
var accountRole = "#role_selection_box"
var accountEmail = "#account_email"
var accountPassword = "#account_password"
var accountId = "#account_id"
var accountDataColumns = 
[
  { title: "First Name", data: null, render: 'first_name' },
  { title: "Last Name", data: null, render: 'last_name' },
  { title: "Contact No", data: null, render: 'contact_no' },
  { title: "Contact Person", data: null, render: 'contact_person' },
  { title: "Street", data: null, render: 'street' },
  { title: "City", data: null, render: 'city' },
  { title: "State", data: null, render: 'state' },
  { title: "Zip", data: null, render: 'zip' },
  { title: "Role", data: null, render: 'role' },
  { title: "Email", data: null, render: 'email' },
  { title: "Password", data: null, render: 'password' },
  { title: "Date_Recorded", data: null, render: function (data, type, row, meta) {
      return data.day + '/' + data.month + '/' + data.year 
    } 
  },
  { title: "", data: null, render: function (data, type, row, meta) {
      return data.active ? '<span style="color:green">Active</span>' : '<span style="color:red">Not Active</span>'
    } 
  },
  { data: '_id', render: function (data, type, row, meta) {
    return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editAccount(\''+data+'\')">Edit</button>':data
  },
}
]
function setAccountFormValues(row) {
  console.log('Set Account Form');
  console.log(row);
  $(accountId).val(row._id);
  $(accountFirstName).val(row.first_name);
  $(accountLastName).val(row.last_name);
  $(accountContactNo).val(row.contact_no);
  $(accountContactPerson).val(row.contact_person);
  $(accountStreet).val(row.street);
  $(accountCity).val(row.city);
  $(accountState).val(row.state);
  $(accountZip).val(row.zip);
  $(accountEmail).val(row.email);
  $(accountPassword).val(row.password);
  $(accountRole).val(row.role).change();
}

function getAccountFormValues() {
  return {
    first_name:$(accountFirstName).val(),
    last_name:$(accountLastName).val(),
    contact_no:$(accountContactNo).val(),
    contact_person:$(accountContactPerson).val(),
    street:$(accountStreet).val(),
    city:$(accountCity).val(),
    state:$(accountState).val(),
    zip:$(accountZip).val(),
    email:$(accountEmail).val(),
    password:$(accountPassword).val(),
    role:$(accountRole).children("option:selected").val(),
    _id: $(accountId).val()
  
  }
}

function getAccountUrl() {
  return used_host + '/account'
}

function getAccountData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getAccountUrl()+'/all',
    xhrFields: {
        // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
        // This can be used to set the 'withCredentials' property.
        // Set the value to 'true' if you'd like to pass cookies to the server.
        // If this is enabled, your server must respond with the header
        // 'Access-Control-Allow-Credentials: true'.
        withCredentials: false
    },
    success: function (json) {
        if (!json.status) {
          console.error('Serverside Error While Geting Accounts');
          console.error(json.message)
        }
        else {
          account_data = json.details
          initAccountTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Accounts");
        console.log(data);
    }
  });
}

function postAccountData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getAccountUrl(),
    dataType: 'json',
    data: data,
    xhrFields: {
        // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
        // This can be used to set the 'withCredentials' property.
        // Set the value to 'true' if you'd like to pass cookies to the server.
        // If this is enabled, your server must respond with the header
        // 'Access-Control-Allow-Credentials: true'.
        withCredentials: false
    },
    success: function (json) {
        if (!json.status) {
          notifyUser('danger', 'Server Error Saving Account')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setAccountFormValues(default_account)
          notifyUser('success', json.message)
          getAllAccounts()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Account')
        console.log("Error Saving Account");
        console.log(data);
    }
  });
}

function initAccountTable() {
  console.log('Account Data');
  console.log(account_data)
  $(accountTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": account_data,
    "stateSave": true,
    "columns": accountDataColumns
  })
}

function getAllAccounts() {
  getAccountData()
}

function addAccount(data) {
  console.log('Add Account');
  console.log(data);
  if(data) {
    if(data.first_name && data.last_name && data.contact_no && data.contact_person && data.street && data.city && data.state && data.zip && data.email && data.password) {
      var row = $.grep(account_data, function (n,i) {
        if(data._id) {
          if( n.first_name && n.last_name && n.contact_no && n.contact_person && n.street && n.city && n.state && n.zip && n.email && n.password) {
            return n.first_name.toLowerCase() == data.first_name.toLowerCase() && n.last_name.toLowerCase() == data.last_name.toLowerCase() && n.contact_no.toLowerCase() == data.contact_no.toLowerCase() && n.contact_person.toLowerCase() == data.contact_person.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase() && n.email.toLowerCase() == data.email.toLowerCase() && n.password.toLowerCase() == data.password.toLowerCase() && n._id != data._id
          }
        } else return n.first_name.toLowerCase() == data.first_name.toLowerCase() && n.last_name.toLowerCase() == data.last_name.toLowerCase() && n.contact_no.toLowerCase() == data.contact_no.toLowerCase() && n.contact_person.toLowerCase() == data.contact_person.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase() && n.email.toLowerCase() == data.email.toLowerCase() && n.password.toLowerCase() == data.password.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'Account With First Name: '+data.first_name+ 'Account With Last Name: '+data.last_name+ 'Or Account With Contact_No: '+data.contact_no + 'Or Account With Contact_Person: '+data.contact_person + 'Or Account With street: '+data.street + 'Or Account With City: '+data.city + 'Or Account With state: '+data.state + 'Or Account With Zip: '+data.zip + 'Or Account With Email: '+data.email + 'Or Account With Password: '+data.password +'Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postAccountData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setAccountFormValues(default_account)
    $(accountModalTitle).text('Add Account')
    $(accountModelId).modal('show')
  }

}

function editAccount(data) {
  console.log('Edit Account');
  console.log(data);
  
  var row = $.grep(account_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setAccountFormValues(row[0])
    $(accountModalTitle).text('Edit Account')
    $(accountModelId).modal('show')
  } else {
    console.log('Account Row Not Found')
  }
}

$('#add_account_button').click(function (params) {
  var data = getAccountFormValues()
  if(!data._id){
    data.day = today.getDate();
    data.month = today.getMonth() + 1;
    data.year= today.getFullYear();
    data.active = false;
  }
  console.log('Got Account Form Values');
  console.log(data);
    
  addAccount(data)
})
