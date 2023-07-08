
if (!TOKEN || !TOKEN.trim().length) {
    window.location.replace("/login");
}

// async function handleGetAllLeagues(){
//     try {
//         let headers = {
//             "Authorization": `Bearer ${TOKEN}`
//         }
//         let response = await axios({
//             method: "get",
//             url: "/leagues/all",
//             headers,
//             data: {},
//         });
//         console.log("response.data", response.data);
//         if (response.data.success) {
            
//         } else {
//             return handleResponseError(response.data.errors);
//         }
//     } catch (err) {
//         return handleErrors(err);
//     }
// }


async function handleGetAllLeaguesLink(){
    try {
        let headers = {
            "Authorization": `Bearer ${TOKEN}`
        }
        let response = await axios({
            method: "Post",
            url: "/api/auth/block_user",
            headers,
            data: {
                staff_id: id,
                status: bol,
            },
        });
        if (response.data.success) {
            return swal("Success",`Account ${bol?"block":"unblock"} successfully`,'success' )
        } else {
            return handleResponseError(response.data.errors);
        }
    } catch (err) {
        return handleErrors(err);
    }
}

// handleGetAllLeagues();
const hobbiesList = document.querySelector('#leagues_holder');
const leagueData = JSON.parse(hobbiesList.getAttribute('data-hobbies'));
console.log("leagueData",leagueData);
let tr = "";

async function handleAddLeagueTOFav(d){
    let myData = d.getAttribute('my-data');
    // try{
        console.log(myData, typeof myData);
        let data = JSON.parse(myData)[0];
        console.log(typeof data, data);
    
        let res_data = await swal({
            text: `DO YOU WANT TO ADD "${data.league.name}" TO FAVOURITE`,
            icon:"Info",
            title: "HELLO"
        });
        if (res_data){
            try{
                let headers = {
                    "Authorization": `Bearer ${TOKEN}`
                }
                let response = await axios({
                    method: "Post",
                    url: "/leagues/add/favourite_to_link",
                    headers,
                    data: {
                        league: data
                    },
                });
                if (response.data.success) {
                    return swal("Success", `${data.league.name} added successfully`, 'success')
                } else {
                    return handleResponseError(response.data.errors);
                }
            } catch (err) {
                return handleErrors(err);
            }
        }
    // }catch(err){

    // }
    
   
}

for (let i = 0; i < leagueData.length; i++) {
    let league = leagueData[i];
    let str_d = JSON.stringify(league);
    tr = tr + `
    <tr>
        <td>

            <!-- Checkbox -->
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="list-checkbox custom-control-input" id="listCheckboxOne">
                <label class="custom-control-label" for="listCheckboxOne"></label>
            </div>

        </td>
        <td>

            <!-- Avatar -->
            <div class="avatar avatar-xs align-middle mr-2">
                <img class="avatar-img rounded-circle" src="${league.league.logo}" alt="${league.league.name}" loading="lazy">
            </div> <a class="item-name text-reset" >${league.league.name}</a>

        </td>
        <td>

            <!-- Text -->
            <span class="item-industry">${league.league.type}</span>

        </td>
        <td>

            <!-- Text -->
            <span class="item-location">${league.country.name}</span>

        </td>
        <td class="item-phone">

            ${league.league.id}

        </td>
        <td>

            ${league.seasons.length}
        </td>
        <td class="text-right">

        <!-- Dropdown -->
        <div class="dropdown">
            <a class="dropdown-ellipses dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fe fe-more-vertical"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
            <a onclick="handleAddLeagueTOFav(this)" my-data='[${str_d}]' class="dropdown-item">
                Add to links
            </a>

            </div>
        </div>

        </td>
    </tr>`
}

let tdata = document.getElementById("append_rows_here");
if (tdata){
    tdata.innerHTML = tr
}
