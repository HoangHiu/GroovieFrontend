// src/components/form/CreateUserForm.tsx
import { useState, useEffect } from "react";
import axios from "axios";

type Group = {
    uuid: string;
    name: string;
    description: string;
    role: string;
};

type CreateUserFormProps = {
    onClose: () => void;
    onSuccess: () => void;
};

function CreateUserForm({ onClose, onSuccess }: CreateUserFormProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [groupId, setGroupId] = useState("");
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:8080/api/v1/group", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const envelope = res.data;
                if (!envelope.success) {
                    setError(envelope.message || 'Failed to load groups');
                    return;
                }
                const filtered = envelope.data.filter((g: Group) => g.role !== 'ADMIN');
                setGroups(filtered);
                if (filtered.length > 0) {
                    setGroupId(filtered[0].uuid);
                }
            } catch (err) {
                console.error('Error fetching groups', err);
                setError('Network error loading roles');
            }
        };
        fetchGroups();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!username || !email || !password || !groupId) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:8080/user',
                {
                    username,
                    password,
                    email,
                    groupIds: [groupId]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Create user failed', err);
            setError(err.response?.data?.message || 'Creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-gray-900/50 flex items-center justify-center z-50">
            <div style={{padding: "20px"}}
                className="bg-[var(--color-ic-seconday-2)] rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 style={{marginBottom: "20px"}} className="text-xl font-semibold mb-4">Create User</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                        Username
                        <input style={{padding:'3px'}}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 p-2 border rounded"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Email
                        <input style={{padding:'3px'}}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 border rounded"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Password
                        <input style={{padding:'3px'}}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 border rounded"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Role
                        <select style={{padding:'3px'}}
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            className="mt-1 p-2 border rounded"
                        >
                            {groups.map((g) => (
                                <option className={"bg-[var(--color-ic-seconday-2)]"} key={g.uuid} value={g.uuid}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button style={{padding:'3px 15px'}}
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-[var(--color-bas-seconday-2)] rounded hover:bg-gray-600 hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button style={{padding:'3px 20px'}}
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 hover:cursor-pointer"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUserForm;