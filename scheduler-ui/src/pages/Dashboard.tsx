import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import {
    Modal,
    Form,
    Input,
    DatePicker,
    TimePicker,
    message,
    Button,
    Select,
} from 'antd';
import moment from 'moment';
import api from '../api/axios';
import axios from 'axios';
import { hasPermission } from '../utils/permissions';
import listPlugin from '@fullcalendar/list';
import './Dashboard.css'; // 👈 Import custom CSS

const { Option } = Select;

const Dashboard: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [inviteForm] = Form.useForm();
    const [userOptions, setUserOptions] = useState<any[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
    const [calendarView, setCalendarView] = useState('timeGridWeek'); // 👈 filter control

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterParticipant, setFilterParticipant] = useState<number | null>(null);

    const token = localStorage.getItem('token');

    // ─────────── FETCH CURRENT USER ─────────── //
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                setCurrentUser(res.data);
            } catch {
                message.error('Failed to fetch user info');
            }
        };
        fetchUser();
    }, []);

    // ─────────── FETCH EVENTS ─────────── //
    const fetchEvents = async () => {
        try {
            const params: any = {};
            if (searchQuery) params.search = searchQuery;
            if (filterParticipant) params.participant_id = filterParticipant;

            const res = await api.get('/events/', { params });
            const mappedEvents = res.data.map((e: any) => ({
                id: e.id,
                title: e.title,
                start: e.start_time,
                end: e.end_time,
            }));
            setEvents(mappedEvents);
        } catch {
            message.error('Failed to load events');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [searchQuery, filterParticipant]); // Re-fetch when filters change

    // ─────────── FETCH USERS ─────────── //
    const fetchUsers = async () => {
        if (hasLoadedUsers) return;
        try {
            const res = await api.get('/users');
            setUserOptions(
                res.data.map((u: any) => ({
                    label: u.name,
                    value: u.id,
                }))
            );
            setHasLoadedUsers(true);
        } catch {
            console.error('Failed to fetch users');
        }
    };

    // ─────────── EVENT CREATION ─────────── //
    const onDateClick = (arg: DateClickArg) => {
        if (!currentUser) {
            message.warning('Please wait, loading user info...');
            return;
        }

        if (
            currentUser.role === 'super_admin' ||
            hasPermission(currentUser?.permissions, 'can_create_events')
        ) {
            const clickedDate = moment(arg.date);
            setStartDate(clickedDate);

            // Critical Fix: Reset form and set initial values when opening
            form.resetFields();
            form.setFieldsValue({
                date: clickedDate,
                start: clickedDate,
                end: clickedDate.clone().add(1, 'hour'),
            });

            setIsEventModalOpen(true);
        } else {
            message.warning('You do not have permission to create events.');
        }
    };

    const onEventFinish = async (values: any) => {
        try {
            setFormError(null);
            const date = values.date;
            const start = date.clone().set({
                hour: values.start.hour(),
                minute: values.start.minute(),
            });
            const end = date.clone().set({
                hour: values.end.hour(),
                minute: values.end.minute(),
            });

            await api.post('/events/', {
                title: values.title,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                participants: values.participants || [],
            });

            message.success('Event added successfully!');
            setIsEventModalOpen(false);
            form.resetFields(); // Clear form
            fetchEvents(); // Refresh events
        } catch (err: any) {
            const apiMsg = err?.response?.data?.detail ?? 'Failed to create event';
            setFormError(apiMsg);
            message.error(apiMsg);
        }
    };

    const handleEventModalClose = () => {
        setIsEventModalOpen(false);
        form.resetFields();
        setFormError(null);
        setStartDate(null);
    };

    const onInviteFinish = async (values: any) => {
        try {
            await axios.post('http://localhost:8000/users/invite-user', values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('User invited successfully!');
            setIsInviteModalOpen(false);
            inviteForm.resetFields();
        } catch (error: any) {
            message.error(error?.response?.data?.detail || 'Failed to invite user.');
        }
    };

    // ─────────── UI ─────────── //
    return (
        <div style={{ padding: '20px' }}>
            {/* Header Section */}
            <div
                className='dashboard-header'
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    marginBottom: '20px',
                }}
            >
                {/* Top Row: Title + Main Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <h2 style={{ margin: 0 }}>Calendar</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                         {hasPermission(currentUser?.permissions, 'can_create_users') && (
                            <Button
                                type="primary"
                                onClick={() => setIsInviteModalOpen(true)}
                            >
                                Invite User
                            </Button>
                        )}
                        <Button
                            className="logout-btn"
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Filter Row: Search + Filters + View Switcher */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    background: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '8px',
                    flexWrap: 'wrap'
                }}>
                    <Input.Search
                        placeholder="Search events..."
                        onSearch={(val) => setSearchQuery(val)}
                        onChange={(e) => {
                            // Optional: Real-time search if preferred, or just on Enter
                            if (e.target.value === '') setSearchQuery('');
                        }}
                        style={{ width: 250 }}
                        allowClear
                    />

                    <Select
                        placeholder="Filter by Participant"
                        style={{ width: 200 }}
                        allowClear
                        onChange={(val) => setFilterParticipant(val)}
                        onFocus={fetchUsers} // Ensure users are loaded
                        options={userOptions}
                    />

                    <div style={{ flex: 1 }}></div>

                    <span style={{ fontWeight: 500 }}>View:</span>
                    <Select
                        value={calendarView}
                        onChange={(value) => setCalendarView(value)}
                        style={{ width: 120 }}
                    >
                        <Option value="dayGridDay">Day</Option>
                        <Option value="timeGridWeek">Week</Option>
                        <Option value="dayGridMonth">Month</Option>
                        <Option value="listYear">List</Option>
                    </Select>
                </div>
            </div>

            {/* Calendar */}
            <div className="calendar-glass-wrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView={calendarView}
                    events={events}
                    dateClick={onDateClick}
                    height="auto"
                    key={calendarView}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridDay,timeGridWeek,dayGridMonth,listYear'
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                        list: 'List'
                    }}
                    dayMaxEvents={true}
                    eventDisplay="block"
                />
            </div>

            {/* ─────────── ADD EVENT MODAL ─────────── */}
            <Modal
                title="Add Event"
                open={isEventModalOpen}
                onCancel={handleEventModalClose}
                footer={null}
            >
                <Form form={form} onFinish={onEventFinish} layout="vertical" className="dashboard-form">
                    {formError && (
                        <div style={{ color: 'red', marginBottom: '10px' }}>{formError}</div>
                    )}
                    <Form.Item
                        label="Event Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter event title' }]}
                    >
                        <Input placeholder="Meeting with client, Team standup, etc." />
                    </Form.Item>
                    <Form.Item
                        label="Date"
                        name="date"
                        initialValue={startDate}
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="participants" label="Invite Users">
                        <Select
                            mode="multiple"
                            options={userOptions}
                            placeholder="Select participants"
                            onFocus={fetchUsers}
                        />
                    </Form.Item>
                    <Form.Item label="Start Time" name="start" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item label="End Time" name="end" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* ─────────── INVITE USER MODAL ─────────── */}
            <Modal
                title="Invite User"
                open={isInviteModalOpen}
                onCancel={() => setIsInviteModalOpen(false)}
                footer={null}
            >
                <Form form={inviteForm} onFinish={onInviteFinish} layout="vertical">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select placeholder="Select role">
                            {hasPermission(currentUser?.permissions, 'can_create_users') && (
                                <Option value="user">User</Option>
                            )}
                            {hasPermission(currentUser?.permissions, 'can_manage_roles') && (
                                <Option value="admin">Admin</Option>
                            )}
                            {hasPermission(currentUser?.permissions, 'can_manage_roles') && (
                                <Option value="super_admin">Super Admin</Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Send Invite
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Dashboard;
