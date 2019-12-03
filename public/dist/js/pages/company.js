//Company 
var company_data = []
var default_company = {
  company_name: "",
  street: "", 
  city : "",
  state: "",
  zip: "",
  day: 0,
  month: 0,
  year: 0,
  active: true
 
}
var companyTableId = "#companyTable"
var companyModelId = "#company-modal"
var companyModalTitle = "#company-modal-title"
var companyCompanyName = "#company_name"
var companyStreet = "#company_street"
var companyCity = "#company_city" 
var companyState = "#company_state"
var companyZip = "#company_zip"
var companyId = "#company_id"
var companyDataColumns = 
[
  { title: "Company Name", data: null, render: 'company_name' },
  { title: "Street", data: null, render: 'street' },
  { title: "City", data: null, render: 'city' },
  { title: "State", data: null, render: 'state' },
  { title: "Zip", data: null, render: 'zip' },
  { title: "Date_Recorded", data: null, render: function (data, type, row, meta) {
      return data.day + '/' + data.month + '/' + data.year 
    } 
  },
  { title: "", data: null, render: function (data, type, row, meta) {
      return data.active ? '<span style="color:green">Active</span>' : '<span style="color:red">Not Active</span>'
    } 
  },
  { data: '_id', render: function (data, type, row, meta) {
    return type === 'display'? '<button class="btn btn-warning btn-block" onclick="editCompany(\''+data+'\')">Edit</button>':data
  },
}
]
function setCompanyFormValues(row) {
  console.log('Set Company Form');
  console.log(row);
  $(companyId).val(row._id);
  $(companyCompanyName).val(row.company_name);
  $(companyStreet).val(row.street);
  $(companyCity).val(row.city);
  $(companyState).val(row.state);
  $(companyZip).val(row.zip);
}

function getCompanyFormValues() {
  return {
    company_name:$(companyCompanyName).val(),
    street:$(companyStreet).val(),
    city:$(companyCity).val(),
    state:$(companyState).val(),
    zip:$(companyZip).val(),
    _id: $(companyId).val()
  
  }
}

function getCompanyUrl() {
  return used_host + '/company'
}

function getCompanyData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getCompanyUrl()+'/all',
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
          console.error('Serverside Error While Geting Companys');
          console.error(json.message)
        }
        else {
          company_data = json.details
          initCompanyTable()
        }
    },
    error: function (data) {
        console.log("Error While Getting Companys");
        console.log(data);
    }
  });
}

function postCompanyData(data) {
  if(!data._id) delete data._id
  $.ajax({
    cache: false,
    type: 'POST',
    url: getCompanyUrl(),
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
          notifyUser('danger', 'Server Error Saving Company')
          console.log('Serverside Error');
          console.log(json.message)
        }
        else {
          setCompanyFormValues(default_company)
          notifyUser('success', json.message)
          getAllCompanys()
        }
    },
    error: function (data) {
      notifyUser('danger', 'Error Saving Company')
        console.log("Error Saving Company");
        console.log(data);
    }
  });
}

function initCompanyTable() {
  console.log('Company Data');
  console.log(company_data)
  $(companyTableId).DataTable({
    "destroy": true,
    "lengthMenu": [[5, 10], [5, 10]],
    "autoWidth": true,
    "data": company_data,
    "stateSave": true,
    "columns": companyDataColumns
  })
}

function getAllCompanys() {
  getCompanyData()
}

function addCompany(data) {
  console.log('Add Company');
  console.log(data);
  if(data) {
    if(data.company_name && data.street && data.city && data.state && data.zip ) {
      var row = $.grep(company_data, function (n,i) {
        if(data._id) {
          if( n.company_name && n.street && n.city && n.state && n.zip ) {
            return n.company_name.toLowerCase() == data.company_name.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase()  && n._id != data._id
          }
        } else return n.company_name.toLowerCase() == data.company_name.toLowerCase() && n.street.toLowerCase() == data.street.toLowerCase() && n.city.toLowerCase() == data.city.toLowerCase() && n.state.toLowerCase() == data.state.toLowerCase() && n.zip.toLowerCase() == data.zip.toLowerCase() 
      })
      if(row.length > 0) {
        notifyUser('warning', 'Company With Company Name: '+data.company_name+  'Or Company With street: '+data.street + 'Or Company With City: '+data.city + 'Or Company With state: '+data.state + 'Or Company With Zip: '+data.zip +'Already Exists!')
      } else {
        console.log('Saving Data')
        console.log(data)
        postCompanyData(data)
      }
    } else {
      notifyUser('error', 'Please Enter Data In All Fields ')
    }
  } else {
    setCompanyFormValues(default_company)
    $(companyModalTitle).text('Add Company')
    $(companyModelId).modal('show')
  }

}

function editCompany(data) {
  console.log('Edit Company');
  console.log(data);
  
  var row = $.grep(company_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setCompanyFormValues(row[0])
    $(companyModalTitle).text('Edit Company')
    $(companyModelId).modal('show')
  } else {
    console.log('Company Row Not Found')
  }
}

$('#add_company_button').click(function (params) {
  var data = getCompanyFormValues()
  if(!data._id){
    data.day = today.getDate();
    data.month = today.getMonth() + 1;
    data.year= today.getFullYear();
    data.active = false;
  }
  console.log('Got Company Form Values');
  console.log(data);
    
  addCompany(data)
})
