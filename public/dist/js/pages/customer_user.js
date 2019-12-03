//CustomerUser 
var customer_user_data = []
var default_customer_user = {
  first_name: "",
  last_name: "",
  contact_no:"",
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
var customer_userTableId = "#customer_userTable"
var customer_userModelId = "#customer_user-modal"
var customer_userModalTitle = "#customer_user-modal-title"
var customer_userFirstName = "#customer_user_first_name"
var customer_userLastName = "#customer_user_last_name"
var customer_userContactNo = "#customer_user_contact_no"
var customer_userStreet = "#customer_user_street"
var customer_userCity = "#customer_user_city" 
var customer_userState = "#customer_user_state"
var customer_userZip = "#customer_user_zip"
var customer_userRole = "#customer_role_selection_box"
var customer_userEmail = "#customer_user_email"
var customer_userPassword = "#customer_user_password"
var customer_userId = "#customer_user_id"
var customer_userDataColumns = 
[
  { title: "First Name", data: null, render: 'first_name' },
  { title: "Last Name", data: null, render: 'last_name' },
  { title: "Contact No", data: null, render: 'contact_no' },
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
    return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editCustomerUser(\''+data+'\')">Edit</button>':data
  },
}
]
function setCustomerUserFormValues(row) {
  console.log('Set CustomerUser Form');
  console.log(row);
  $(customer_userId).val(row._id);
  $(customer_userFirstName).val(row.first_name);
  $(customer_userLastName).val(row.last_name);
  $(customer_userContactNo).val(row.contact_no);
  $(customer_userStreet).val(row.street);
  $(customer_userCity).val(row.city);
  $(customer_userState).val(row.state);
  $(customer_userZip).val(row.zip);
  $(customer_userEmail).val(row.email);
  $(customer_userPassword).val(row.password);
  $(customer_userRole).val(row.role).change();
}

function getCustomerUserFormValues() {
  return {
    first_name:$(customer_userFirstName).val(),
    last_name:$(customer_userLastName).val(),
    contact_no:$(customer_userContactNo).val(),
    street:$(customer_userStreet).val(),
    city:$(customer_userCity).val(),
    state:$(customer_userState).val(),
    zip:$(customer_userZip).val(),
    email:$(customer_userEmail).val(),
    password:$(customer_userPassword).val(),
    role:$(customer_userRole).children("option:selected").val(),
    _id: $(customer_userId).val()
  
  }
}

function getCustomerUserUrl() {
  return used_host + '/customer_user'
}

function getCustomerUserData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getCustomerUserUrl()+'/all',
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
          console.error('Serverside Error While Geting CustomerUsers');
          console.error(json.message)
        }
        else {
          customer_user_data = json.details
          initCustomerUserTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting CustomerUsers");
        console.log(data);
    }
  });
}

function postCustomerUserData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getCustomerUserUrl(),
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
          notifyUser('danger', 'Server Error Saving CustomerUser')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setCustomerUserFormValues(default_customer_user)
          notifyUser('success', json.message)
          getAllCustomerUsers()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving CustomerUser')
        console.log("Error Saving CustomerUser");
        console.log(data);
    }
  });
}

function initCustomerUserTable() {
  console.log('CustomerUser Data');
  console.log(customer_user_data)
  $(customer_userTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": customer_user_data,
    "stateSave": true,
    "columns": customer_userDataColumns
  })
}

function getAllCustomerUsers() {
  getCustomerUserData()
}

function addCustomerUser(data) {
  console.log('Add CustomerUser');
  console.log(data);
  if(data) {
    if(data.first_name && data.last_name && data.contact_no && data.street && data.city && data.state && data.zip && data.email && data.password) {
      var row = $.grep(customer_user_data, function (n,i) {
        if(data._id) {
          if( n.first_name && n.last_name && n.contact_no && n.street && n.city && n.state && n.zip && n.email && n.password) {
            return n.first_name.toLowerCase() == data.first_name.toLowerCase() && n.last_name.toLowerCase() == data.last_name.toLowerCase() && n.contact_no.toLowerCase() == data.contact_no.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase() && n.email.toLowerCase() == data.email.toLowerCase() && n.password.toLowerCase() == data.password.toLowerCase() && n._id != data._id
          }
        } else return n.first_name.toLowerCase() == data.first_name.toLowerCase() && n.last_name.toLowerCase() == data.last_name.toLowerCase() && n.contact_no.toLowerCase() == data.contact_no.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase() && n.email.toLowerCase() == data.email.toLowerCase() && n.password.toLowerCase() == data.password.toLowerCase()
      })
      if(row.length > 0) {
        notifyUser('warning', 'CustomerUser With First Name: '+data.first_name+ 'CustomerUser With Last Name: '+data.last_name+ 'Or CustomerUser With Contact_No: '+data.contact_no +  'Or CustomerUser With street: '+data.street + 'Or CustomerUser With City: '+data.city + 'Or CustomerUser With state: '+data.state + 'Or CustomerUser With Zip: '+data.zip + 'Or CustomerUser With Email: '+data.email + 'Or CustomerUser With Password: '+data.password +'Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postCustomerUserData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setCustomerUserFormValues(default_customer_user)
    $(customer_userModalTitle).text('Add CustomerUser')
    $(customer_userModelId).modal('show')
  }

}

function editCustomerUser(data) {
  console.log('Edit CustomerUser');
  console.log(data);
  
  var row = $.grep(customer_user_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setCustomerUserFormValues(row[0])
    $(customer_userModalTitle).text('Edit CustomerUser')
    $(customer_userModelId).modal('show')
  } else {
    console.log('CustomerUser Row Not Found')
  }
}

$('#add_customer_user_button').click(function (params) {
  var data = getCustomerUserFormValues()
  if(!data._id){
    data.day = today.getDate();
    data.month = today.getMonth() + 1;
    data.year= today.getFullYear();
    data.active = false;
  }
  console.log('Got CustomerUser Form Values');
  console.log(data);
    
  addCustomerUser(data)
})
