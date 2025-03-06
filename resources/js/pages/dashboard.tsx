import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Quotation {
    total: number;
    currency_id: string;
    quotation_id: number;
}

export default function Dashboard({token}: {token: string}) {

    const [createdQuotation, setCreatedQuotation] = useState<Quotation | null>(null);
    const [age, setAge] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(null);

    const handleQuotationCreation = async (e: React.FormEvent) => {
        e.preventDefault();

        await axios
            .post(
                route('quotation'),
                {
                    age,
                    currency_id: currency,
                    start_date: startDate,
                    end_date: endDate,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                setCreatedQuotation(response.data);
                setAge('');
                setCurrency('');
                setStartDate('');
                setEndDate('');
                setErrors(null);
            })
            .catch((error) => {
                setErrors(error.response.data.errors);
                console.log(error);
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                {createdQuotation && (
                    <div className="max-w-8xl mx-auto min-w-1/3 rounded-xl border p-4 shadow-md">
                        <h3 className="text-center text-white">Quotation Created</h3>
                        <p className="text-center text-white">
                            Total: {createdQuotation.total} {createdQuotation.currency_id}
                        </p>
                        <p className="text-center text-white">Quotation ID: {createdQuotation.quotation_id}</p>
                    </div>
                )}
                <div className="max-w-8xl mx-auto min-w-1/3 rounded-xl border p-4 shadow-md">
                    <h3 className="text-center text-white">Quotation</h3>
                    <form onSubmit={handleQuotationCreation} className="mt-3 flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                type="text"
                                id="age"
                                name="age"
                                placeholder="ex: 21, 22, 23"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            <small className="text-gray-500">Ages must be separated by comma</small>
                            {errors && errors.age && errors.age.map((error, index) => <InputError key={index} message={error} />)}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="currency_id">Currency</Label>
                            <Input
                                type="text"
                                id="currency_id"
                                name="currency_id"
                                placeholder="ex: USD, EUR, GBP"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            />
                            {errors && errors.currency_id && errors.currency_id.map((error, index) => <InputError key={index} message={error} />)}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input type="date" id="start_date" name="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            {errors && errors.start_date && errors.start_date.map((error, index) => <InputError key={index} message={error} />)}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input type="date" id="end_date" name="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            {errors && errors.end_date && errors.end_date.map((error, index) => <InputError key={index} message={error} />)}
                        </div>

                        <Button type="submit" className="w-full">
                            Create
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
