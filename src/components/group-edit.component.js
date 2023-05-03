import React, { Component } from 'react';
import axios from 'axios';
import * as Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import Select from 'react-select'

export default class EditGroup extends Component {
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
        axios.get('http://localhost:5000/group/' + this.props.groupId)
            .then(response => {
                this.setState({
                    participants: response.data.participants,
                    grpName: response.data.grpName,
                    date: new Date(response.data.date),
                    description: response.data.description,
                })
            })
            .catch(function (error) {
                console.log(error);
            })

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

    refreshTable() {
        axios.get('http://localhost:5000/group/')
            .then(response => {
                this.setState({ group: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onSubmit(e) {
        e.preventDefault();
        const group = {
            participants: this.state.participants,
            grpName: this.state.grpName,
            date: this.state.date,
            description: this.state.description,
        }

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
            axios.put('http://localhost:5000/group/' + this.props.groupId, group)
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.refreshTable();
                        this.props.close();
                        Swal.fire({
                            icon: 'success',
                            title: 'Successful',
                            text: 'Group details has been updated!',
                            background: '#fff',
                            confirmButtonColor: '#133EFA',
                            iconColor: '#60e004'
                        })

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'There was an error updating Group detaiils!',
                            background: '#fff',
                            confirmButtonColor: '#133EFA',
                            iconColor: '#e00404'
                        })
                    }
                })
        }
    }

    render() {
        return (
            <div className="flex flex-col px-5">
                <div className=" sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className='items-center'>
                            <div className=''>
                                <div class="grid grid-cols-1 gap-4 content-start pt-5 px-40">
                                    <form className='' onSubmit={this.onSubmit}>
                                        <div class="">
                                            <p className='text-4xl font-semibold text-black uppercase drop-shadow-lg'>
                                                Update a Group Now
                                            </p>
                                            <div class="">
                                                <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Group Name : </label>
                                                <input type="text"
                                                    required
                                                    className="form-control "
                                                    value={this.state.grpName}
                                                    onChange={this.onChangeGroupName}
                                                />
                                            </div><p className="text-red-600 validateMsg">{this.state.groupNameError}</p>

                                            <div className="grid grid-cols-2 gap-4 form-group">
                                                <div className="form-group">
                                                    <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Date : </label>
                                                    <div>
                                                        <DatePicker
                                                            className='m-2'
                                                            selected={this.state.date}
                                                            onChange={this.onChangeDate}
                                                        />
                                                    </div>
                                                </div><p className="text-red-600 validateMsg">{this.state.dateError}</p>

                                                <div class="">
                                                    <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Description : </label>
                                                    <textarea
                                                        type="textarea"
                                                        required
                                                        className="form-control "
                                                        value={this.state.description}
                                                        onChange={this.onChangeDescription}
                                                    />
                                                </div><p className="text-red-600 validateMsg">{this.state.descriptionError}</p>
                                            </div>

                                            <div className="form-group ">
                                                <label className='block mb-2 text-lg font-medium text-gray-900 dark:text-white' for="grid-state">Names : </label>
                                                <Select
                                                    options={this.state.options}
                                                    isMulti
                                                    required
                                                    onChange={(choice) => this.onChangeParticipants(choice)} /><p />
                                            </div>

                                            <div className="text-center align-middle form-group">
                                                <input className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' type="submit" value="Update" />
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