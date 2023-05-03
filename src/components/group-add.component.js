import React, { Component } from 'react';
import axios from 'axios';
import * as Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import Select from 'react-select'

export class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.onChangeParticipants = this.onChangeParticipants.bind(this);
        this.onChangeGroupName = this.onChangeGroupName.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            participants: [],
            grpName: '',
            date: new Date(),
            description: '',
            names: [],
            options: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/employee/')
            .then(response => {
                this.setState({
                    names: response.data,
                })
                const tempOptions = [
                ]
                response.data.forEach((item) => {
                    let tempObject = {
                        value: item.name,
                        label: item.name
                    }
                    tempOptions.push(tempObject);
                })
                this.setState({
                    options: tempOptions
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChangeParticipants(choice) {
        let participantsArr = [];
        choice.forEach(participant => {
            participantsArr.push(participant.value);
        })
        console.log("participantsArr", participantsArr);
        this.setState({
            participants: participantsArr
        })
    }

    onChangeGroupName(e) {
        this.setState({
            grpName: e.target.value
        });
    }

    onChangeDate(date) {
        this.setState({
            date: date
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const group = {
            participants: this.state.participants,
            grpName: this.state.grpName,
            date: this.state.date,
            description: this.state.description,
        }

        //Validations for inputs
        if (this.state.grpName.length < 3) {
            this.setState({ groupNameError: "Select a GroupName" })
        }
        else if (this.state.date.length < 4) {
            this.setState({ dateError: "date must be set" })
        }
        else if (this.state.description.length < 10) {
            this.setState({ descriptionError: "Description must be set (must contain more than 10 digits)" })
        } else {

            //checking the submitted dataset (payload checking)
            console.log(group);
            axios.post('http://localhost:5000/group/add', group)
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.clearData();
                        Swal.fire({
                            icon: 'success',
                            title: 'Successful',
                            text: 'Group has been created! : ',
                            background: '#fff',
                            confirmButtonColor: '#133EFA',
                            iconColor: '#60e004'
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error in creating the Group!',
                            background: '#fff',
                            confirmButtonColor: '#133EFA',
                            iconColor: '#e00404'
                        })
                    }
                })
        }
    }

    clearData = () => {
        this.setState({
            participants: '',
            grpName: '',
            date: '',
            description: ''
        })
    }

    render() {
        return (
            <div className="flex flex-col px-5">
                <div className=" sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className='items-center'>
                            <div className=''>
                                <div class="container grid grid-cols-1 gap-4 content-start pt-5 px-40">
                                    <form className='px-20 py-10 border-2 rounded-lg shadow-md bg-gray-50' onSubmit={this.onSubmit}>
                                        <div class="">
                                            <p className='text-4xl font-semibold text-black uppercase drop-shadow-lg'>
                                                Create a Group Now
                                            </p>
                                            <div class="">
                                                <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Group Name : </label>
                                                <input type="text"
                                                    required
                                                    className="form-control "
                                                    value={this.state.grpName}
                                                    placeholder='Type Group Name'
                                                    onChange={this.onChangeGroupName}
                                                /><p className="text-red-600 validateMsg">{this.state.groupNameError}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 form-group">
                                                <div className="form-group">
                                                    <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Date : </label>
                                                    <div>
                                                        <DatePicker
                                                            className='m-2'
                                                            selected={this.state.date}
                                                            onChange={this.onChangeDate}
                                                        /><p className="text-red-600 validateMsg">{this.state.dateError}</p>
                                                    </div>
                                                </div>

                                                <div class="">
                                                    <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Description : </label>
                                                    <textarea
                                                        type="textarea"
                                                        required
                                                        placeholder='Type Description'
                                                        className="form-control "
                                                        value={this.state.description}
                                                        onChange={this.onChangeDescription}
                                                    /><p className="text-red-600 validateMsg">{this.state.descriptionError}</p>
                                                </div>
                                            </div>

                                            <div className="form-group ">
                                                <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white' for="grid-state">Names : </label>
                                                <Select
                                                    options={this.state.options}
                                                    isMulti
                                                    required
                                                    onChange={(choice) => this.onChangeParticipants(choice)} />
                                            </div>

                                            <div className="mt-8 text-center align-middle form-group">
                                                <input className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' type="submit" value="Create" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}