var csrfToken = $('meta[name="csrf-token"]').attr('content');
var refNumber;
var reason;
var generalId = 0;
var save = 0;
var globalRequestCategoriesId;
var globalRequestCategoriesSub0Id;
var globalRequestCategoriesSub1Id;
var globalRequestCategoriesSub2Id;
var subCatch00;
var subCatch01;
var subCatch02;

$(document).ready(function() {
    factoryDropdown();
    requirementDropdown();
    internalExternal();
    categoriesSub0();
    categoriesSub1();
    categoriesSub2();
});

function logoutBtn() {
    $.ajax({
        url: '/logout',
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function () {
            window.location.assign('/login'); 
        }
    });
}

function newBtn() {
    generalId = 0;
    prints = 0;
    document.getElementById("saveBtn").disabled = false;
    var date = $('#date_today').attr("data-date");
    var form = document.getElementById("hidden_form");
    form.removeAttribute("hidden");

    document.getElementById('RefNumber').value = "";
    document.getElementById('myDate').value = date;
    document.getElementById('RequestingDepartment').value = "";
    document.getElementById('EmployeeName').value = "";
    document.getElementById('Department').value = "";
    document.getElementById('Position').value = "";
    document.getElementById('DateHired').value = "";
    document.getElementById('Factory').value = "";
    document.getElementById('Requirement').value = "";
    document.getElementById('Reason').value = "";
    document.getElementById('Remarks').value = "";

    globalRequestCategoriesId = 0;
    globalRequestCategoriesSub0Id = 0;
    globalRequestCategoriesSub1Id = 0;
    globalRequestCategoriesSub2Id = 0;

    internalExternal(globalRequestCategoriesId);
    categoriesSub0(globalRequestCategoriesSub0Id);
    categoriesSub1(globalRequestCategoriesSub1Id);
    categoriesSub2(globalRequestCategoriesSub2Id);
}

function searchBtn() {
    refNumber = document.getElementById('RefNumber').value.trim();
    if (refNumber == '' || refNumber == undefined) {
        check = false;
        
        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Reference Number.',
            icon: 'error'
        });

        return;
    }

    $.ajax({
        url: '/viewDaihoRequest',
        type: 'post',
        data: {
            refNumber: refNumber
        },
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            
            if (data) {
                //validation
                $.each(data, function(key, value) {
                    var form = document.getElementById("hidden_form");
                    form.removeAttribute("hidden");

                    document.getElementById('myDate').value = value.Request_Date;
                    document.getElementById('RequestingDepartment').value = value.Requesting_Department;
                    document.getElementById('EmployeeName').value = value.Employee_Full_Name;
                    document.getElementById('Department').value = value.Department;
                    document.getElementById('Position').value = value.Position;
                    document.getElementById('DateHired').value = value.Date_Hired;
                    document.getElementById('Factory').value = value.Factory_id;
                    document.getElementById('Requirement').value = value.Requirement_id;
                    document.getElementById('Reason').value = value.Reason;
                    document.getElementById('Remarks').value = value.Remarks;

                    var prints = value.Prints;
                    generalId = value.id;
                    globalRequestCategoriesId = parseInt(value.Request_Categories_id);
                    globalRequestCategoriesSub0Id = parseInt(value.Request_Categories_Sub_0_id);
                    globalRequestCategoriesSub1Id = parseInt(value.Request_Categories_Sub_1_id);
                    globalRequestCategoriesSub2Id = parseInt(value.Request_Categories_Sub_2_id);

                    internalExternal(globalRequestCategoriesId);
                    categoriesSub0(globalRequestCategoriesSub0Id);
                    categoriesSub1(globalRequestCategoriesSub1Id);
                    categoriesSub2(globalRequestCategoriesSub2Id);

                    document.getElementById("printBtn").style.display = "inline-block";

                    if (prints == 0) {
                    document.getElementById("saveBtn").disabled = false;
                    } else {
                    document.getElementById("saveBtn").disabled = true;

                    }
                });
            } else {
                Swal.fire({
                    title: 'Error.',
                    text: 'Not Existing',
                    icon: 'error'
                });
            }
        }
    })
    return;
}

//print 
function printBtn() {
    if (save > 0 || generalId > 0) {
        var print = 1;
        $.ajax({
            url:'/printDaihoRequest',
            type: 'POST',
            data: { 
                generalId: generalId,
                print: print

            },
            headers: {
                'X-CSRF-TOKEN': csrfToken
            },
            success: function (data) {
                var data = JSON.parse(data);
                window.location.assign('/print/' + generalId);

            }
        });
    } else {
        
        Swal.fire({
            title: 'Error.',
            text: 'You need to save request first',
            icon: 'error'
        });
    }

}

function saveBtn() {
    //validation
    var dateValue = document.getElementById('myDate').value.trim();
    var requestingDepartment = document.getElementById('RequestingDepartment').value.trim();
    var employeeName = document.getElementById('EmployeeName').value.trim();
    var department= document.getElementById('Department').value.trim();
    var position = document.getElementById('Position').value.trim();
    var dateHired = document.getElementById('DateHired').value.trim();
    var factory = document.getElementById('Factory').value;
    var requirement = document.getElementById('Requirement').value.trim();
    var requestCategories = $('input[name="category"]:checked').val();
    var requestCategoriesSub0 = $('input[name="categorySub0"]:checked').val();
    var requestCategoriesSub1 = $('input[name="categorySub1"]:checked').val();
    var requestCategoriesSub2 = $('input[name="categorySub2"]:checked').val();
    var reason = document.getElementById('Reason').value;
    var remarks = document.getElementById('Remarks').value;
    var check = true;

    if (requestingDepartment == '' || requestingDepartment == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Department.',
            icon: 'error'
        });

        return;
    }
    
    if (dateValue == '' || dateValue == undefined) {
        check = false;
        
        Swal.fire({
            title: 'Error.',
            text: 'Please Select Date.',
            icon: 'error'
        });

        return;
    }

    if (employeeName == '' || employeeName == undefined) {
        check = false;
        
        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Employee Name.',
            icon: 'error'
        });

        return;
    }

    if (department == '' || department == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Department',
            icon: 'error'
        });

        return;
    }

    if (position == '' || position == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Position',
            icon: 'error'
        });

        return;
    }

    if (dateHired == '' || dateHired == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Select Date Hired ',
            icon: 'error'
        });
        
        return;
    }

    if (factory == '' || factory == undefined) {
        check = false;
        
        Swal.fire({
            title: 'Error.',
            text: 'Please Select Factory',
            icon: 'error'
        });

        return;
    }

    if (requirement == '' || requirement == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Select Requirement',
            icon: 'error'
        });

        return;
    }

//internal external check
    if (requestCategories == '' || requestCategories == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Select Request Category',
            icon: 'error'
        });

        return;
    }

    if (requestCategoriesSub0 == '' || requestCategoriesSub0 == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Select Sub Category',
            icon: 'error'
        });

        return;
    }

    if (requestCategoriesSub0 == 1 || requestCategoriesSub0 == 6) {
        if (requestCategoriesSub1 == '' || requestCategoriesSub1 == undefined) {
            check = false;

            Swal.fire({
                title: 'Error.',
                text: 'Please Select Sub Category',
                icon: 'error'
            });

            return;
        }
    }

    if (requestCategoriesSub1 == 1 || requestCategoriesSub1 == 2) {
        if (requestCategoriesSub2 == '' || requestCategoriesSub2 == undefined) {
            check = false;

            Swal.fire({
                title: 'Error.',
                text: 'Please Select Sub Category',
                icon: 'error'
            });

            return;
        }
    }

    if (reason == '' || reason == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Reason',
            icon: 'error'
        });

        return;
    }

    if (remarks == '' || remarks == undefined) {
        check = false;

        Swal.fire({
            title: 'Error.',
            text: 'Please Enter Remarks',
            icon: 'error'
        });

        return;
    }
    
    if (check) {
        save = 1;
        //save validation
        if (generalId == 0){
            //add new request
            saveData(dateValue, requestingDepartment, employeeName, department, 
                position, dateHired, factory, requirement, requestCategories, 
                requestCategoriesSub0, requestCategoriesSub1, requestCategoriesSub2, reason, remarks);
            
                return;
        } else {
            //update request
            updateData(generalId, requestingDepartment, employeeName, department, 
                position, dateHired, factory, requirement, requestCategories, 
                requestCategoriesSub0, requestCategoriesSub1, requestCategoriesSub2, reason, remarks);

                return;
        }
    }
}

//add new request
function saveData(dateValue, requestingDepartment, employeeName, 
    department, position, dateHired, factory, requirement, requestCategories, 
    requestCategoriesSub0, requestCategoriesSub1, requestCategoriesSub2, reason, remarks) {

    $.ajax({
        url:'/addDaihoRequest',
        type: 'POST',
        data: {
            dateValue: dateValue,
            requestingDepartment: requestingDepartment,
            employeeName: employeeName,
            department: department,
            position: position,
            dateHired: dateHired,
            factory: factory,
            requirement: requirement,
            requestCategories: requestCategories,
            requestCategoriesSub0: requestCategoriesSub0,
            requestCategoriesSub1: requestCategoriesSub1,
            requestCategoriesSub2: requestCategoriesSub2,
            reason: reason,
            remarks: remarks

        },
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            if (data) {
                Swal.fire({
                    title: 'Your Reference # is ' + data,
                    text: 'PLEASE SAVE YOUR REFERENCE #',
                    icon: 'success',
                    type: 'success'
                })
                newBtn();
            } else {
                Swal.fire({
                    title: 'ERROR!',
                    text: 'PLEASE CHECK INFORMATIONS',
                    icon: 'error',
                    type: 'error'
                })
            }
        }
    });
}

function updateData(generalId, requestingDepartment, employeeName, 
    department, position, dateHired, factory, requirement, requestCategories, 
    requestCategoriesSub0, requestCategoriesSub1, requestCategoriesSub2, reason, remarks) {

    $.ajax({
        url:'/updateDaihoRequest',
        type: 'POST',
        data: {
            generalId: generalId,
            requestingDepartment: requestingDepartment,
            employeeName: employeeName,
            department: department,
            position: position,
            dateHired: dateHired,
            factory: factory,
            requirement: requirement,
            requestCategories: requestCategories,
            requestCategoriesSub0: requestCategoriesSub0,
            requestCategoriesSub1: requestCategoriesSub1,
            requestCategoriesSub2: requestCategoriesSub2,
            reason: reason,
            remarks: remarks

        },
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);

            if (data) {
                Swal.fire({
                    title: 'Success',
                    text: 'Updated!',
                    icon: 'success',
                    type: 'success'
                })
            }
        }
    });

}

// Dynamic Options
function factoryDropdown() {
    $.ajax({
        url: 'getFactoryDropdown',
        type: 'post',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            var factoryDropdownOptions = '<option value="" disabled selected> Select Factory </option>';

            if (data) {
                for (var index = 0; index < data.length; index++) {
                    factoryDropdownOptions += '<option id="' + data[index]['id'] + '" value="' + data[index]['id'] + '">' + data[index]['name'] + '</option>';
                }

                $('#Factory').empty().append(factoryDropdownOptions);
            }
        }
    });
}

function requirementDropdown() {
    $.ajax({
        url: 'getRequirementDropdown',
        type: 'post',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            var requirementDropdownOptions = '<option value="" disabled selected> Select Requirement </option>';

            if (data) {
                for (var index = 0; index < data.length; index++) {
                    requirementDropdownOptions += '<option id="' + data[index]['id'] + '" value="' + data[index]['id'] + '">' + data[index]['name'] + '</option>';
                }

                $('#Requirement').empty().append(requirementDropdownOptions);
            }
        }
    });
}

//InternalExternal radioBtn:  show categoriesSub
$(document).on('click', 'input[name="category"]', function() {
    var type = $(this).val();
    categoriesSub0(type); 
});

//categoriesSub radioBtn: show categoriesSub1
$(document).on('click', 'input[name="categorySub0"]', function() {
    var subType = $(this).val();
    categoriesSub1(subType);
});

//categoriesSub radioBtn: show categoriesSub2
$(document).on('click', 'input[name="categorySub1"]', function() {
    var subType = $(this).val();
    categoriesSub2(subType);
});

//categoriesSub radioBtn: show categoriesSub3
$(document).on('click', 'input[name="categorySub2"]', function() {
    var subType = $(this).val();
});

//internal external
function internalExternal(globalRequestCategoriesId){
    $.ajax({
        url: 'getInternalExternal',
        type: 'post',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            var requestCategoriesBtn ='';
            //data: Internal, External / Display categoriesSub
            if (data) {
                for (var index = 0; index < data.length; index++) {
                    //button for internal / external
                    requestCategoriesBtn += '<label style="width:100%; height: 30px; margin-left: 30px;">' + 
                    '<input type="radio" name="category" id="category' + data[index]['id'] + '" value="' + 
                    data[index]['id'] + '">' + data[index]['name'] + '</label><br>' +
                    //div for PC-other / email - other
                    '<div class=categoriesSub00 id="categoriesSub1' + data[index]['id'] + '" style="margin-left: 20px;"></div>';
                }
            }

            $('#InternalExternalCategories').empty().append(requestCategoriesBtn);
            $('#InternalExternalCategories input[type="radio"][id="category' + globalRequestCategoriesId + '"]').click();
        }
    });

}
//internal:pcd-other external:email-other
function categoriesSub0(subType0) {
    $.ajax({
        url: 'getCategoriesSub0',
        type: 'post',
        data: {
            subType0 : subType0,
        },
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            var categoriesSubBtn0 ='';
            //data: Internal Sub(PCD-other), External Sub(email-other)  / Display categoriesSub1
            if (data) {
                for (var index = 0; index < data.length; index++) {
                    //button for PC-other /Email-other
                    categoriesSubBtn0 += '<label style="width:100%; height: 30px; margin-left: 30px;">' + 
                    '<input type="radio" name="categorySub0" id="sub00' + data[index]['id'] + '" value="' + 
                    data[index]['id'] + '">' + data[index]['name'] + '</label><br>' +
                    //div for laptop-desktop / email creation-delisting
                    '<div class=categoriesSub01 id="categoriesSub2' + data[index]['id'] + '" style="margin-left: 20px;"></div>';
                }
            }

            $('.categoriesSub00').empty();
            $('#categoriesSub1' + subType0).html(categoriesSubBtn0); 

            //handle categoriesSub0(globalRequestCategoriesSub0Id);
            if (Number.isInteger(subType0)) {
                subCatch00 = subType0;
            }

            $('#sub00' + subCatch00).click().prop('checked', true);
        }
    });
}

//internal:laptop-desktop external:create-del
function categoriesSub1(subType1) {
    $.ajax({
        url: 'getCategoriesSub1',
        type: 'post',
        data: {
            subType1 : subType1
        },
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            var categoriesSubBtn1 ='';
            //data: Internal Sub PCD(Laptop-Desktop), External Sub Email(Create-Del) / Display categoriesSub2
            if (data) {
                for (var index = 0; index < data.length; index++) {
                    //button for PC-other / Email-other
                    categoriesSubBtn1 += '<label style="width:100%; height: 30px; margin-left: 30px;">' + 
                    '<input type="radio" name="categorySub1" id="sub01' + data[index]['id'] + '" value="' + 
                    data[index]['id'] + '">' + data[index]['name'] + '</label><br>' +
                    //div for laptop-desktop / email creation-delisting
                    '<div class=categoriesSub02 id="categoriesSub3' + data[index]['id'] + '" style="margin-left: 20px;"></div>';
                }
            }

            $('.categoriesSub01').empty();
            $('#categoriesSub2' + subType1).html(categoriesSubBtn1); 
            
            //handle categoriesSub1(globalRequestCategoriesSub1Id);
            if (Number.isInteger(subType1)) {
                subCatch01 = subType1;
            }

            $('#sub01' + subCatch01).click().prop('checked', true);
        }
    });
}   
//internal: new-return
function categoriesSub2(subType2) {
    $.ajax({
        url: 'getCategoriesSub2',
        type: 'post',
        data: {
            subType2 : subType2
        },
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (data) {
            var data = JSON.parse(data);
            var categoriesSubBtn2 ='';
            //data: Laptop-Desktop, Create-Del / Display: New-Return
            if (data) {
                for (var index = 0; index < data.length; index++) {
                    //button for new-return(laptop-desktop sub)
                    categoriesSubBtn2 += '<label style="width:100%; height: 30px; margin-left: 30px;">' + 
                    '<input type="radio" name="categorySub2" id="sub02' + data[index]['id'] + '" value="' + 
                    data[index]['id'] + '">' + data[index]['name'] + '</label><br>' 
                }
            }
            
            $('.categoriesSub02').empty();
            $('#categoriesSub3' + subType2).html(categoriesSubBtn2);
            
            //handle categoriesSub1(globalRequestCategoriesSub1Id);
            if (Number.isInteger(subType2)) {
                subCatch02 = subType2;
            }

            $('#sub02' + subCatch02).click().prop('checked', true);
        }
    });
}       