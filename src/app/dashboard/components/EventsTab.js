"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function EventsTab() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "", date: "", comingSoon: false, image: "", description: "", link: ""
    });
    const [editingId, setEditingId] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('events').select('*');
            if (error) throw error;
            const evts = data || [];

            // Sort by comingSoon first, then date
            evts.sort((a, b) => {
                if (a.comingSoon === b.comingSoon) {
                    return new Date(a.date) - new Date(b.date);
                }
                return a.comingSoon ? -1 : 1;
            });
            setEvents(evts);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert("Error loading events: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase.from('events').update(formData).eq('id', editingId);
                if (error) throw error;
                setEditingId(null);
            } else {
                const { error } = await supabase.from('events').insert([formData]);
                if (error) throw error;
            }
            setFormData({ title: "", date: "", comingSoon: false, image: "", description: "", link: "" });
            fetchEvents();
        } catch (error) {
            alert("Error saving event: " + error.message);
        }
    };

    const handleEdit = (event) => {
        setEditingId(event.id);
        setFormData({
            title: event.title || "",
            date: event.date || "",
            comingSoon: event.comingSoon || false,
            image: event.image || "",
            description: event.description || "",
            link: event.link || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (error) throw error;
            fetchEvents();
        } catch (error) {
            alert("Error deleting event: " + error.message);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ title: "", date: "", comingSoon: false, image: "", description: "", link: "" });
    };

    return (
        <div>
            {/* Event Management Form */}
            <div className="mb-10 glass-card p-6">
                <h2 className="text-xl font-bold font-orbitron text-white mb-4">
                    {editingId ? "EDIT EVENT" : "CREATE NEW EVENT"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required
                        className="bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400" />

                    <div className="flex items-center gap-4 bg-slate-900 border border-slate-600 rounded px-4 py-2">
                        <input type="date" name="date" value={formData.date} onChange={handleChange}
                            disabled={formData.comingSoon} required={!formData.comingSoon}
                            className={`bg-transparent text-white focus:outline-none flex-grow ${formData.comingSoon ? "opacity-50" : ""}`} />
                        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                            <input type="checkbox" name="comingSoon" checked={formData.comingSoon} onChange={handleChange}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-500" />
                            COMING SOON
                        </label>
                    </div>

                    <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL (Unsplash/Imgur)"
                        className="md:col-span-2 bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Event Description" rows="2" required
                        className="md:col-span-2 bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400"></textarea>
                    <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="Registration Link"
                        disabled={formData.comingSoon}
                        className={`md:col-span-2 bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400 ${formData.comingSoon ? "opacity-50" : ""}`} />

                    <div className="md:col-span-2 flex gap-4">
                        <button type="submit" className="flex-grow bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold font-orbitron py-2 rounded hover:opacity-90 transition-opacity">
                            {editingId ? "UPDATE EVENT" : "PUBLISH EVENT"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="px-6 bg-slate-700 text-white font-bold font-orbitron py-2 rounded hover:bg-slate-600 transition-colors">
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Event List */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                    <h2 className="text-lg font-bold font-orbitron text-white">EXISTING EVENTS</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4">Event</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="3" className="p-8 text-center text-slate-500 italic">Loading events...</td></tr>
                            ) : events.length === 0 ? (
                                <tr><td colSpan="3" className="p-8 text-center text-slate-500">No events found.</td></tr>
                            ) : (
                                events.map(event => (
                                    <tr key={event.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{event.title}</div>
                                            <div className="text-[10px] text-slate-500 max-w-xs truncate">{event.description}</div>
                                        </td>
                                        <td className="p-4">
                                            {event.comingSoon ? (
                                                <span className="text-purple-400 text-xs font-bold">COMING SOON</span>
                                            ) : (
                                                <span className="text-slate-300 text-sm">{event.date}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                            <button onClick={() => handleEdit(event)} className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white text-xs rounded border border-cyan-600/50 transition-all">EDIT</button>
                                            <button onClick={() => handleDelete(event.id)} className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs rounded border border-red-600/50 transition-all">DELETE</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
