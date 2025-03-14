"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
	initialData: {
		categoryId: string | null;
	};
	courseId: string;
	options: { label: string; value: string; }[];
};

const formSchema = z.object({
	categoryId: z.string().min(1),
});

const CategoryForm = ({
	initialData,
	courseId,
	options,
}: CategoryFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryId: initialData.categoryId ?? "",
		},
	})

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const selectedOption = options.find((option) => option.label === values.categoryId)
			await axios.patch(`/api/courses/${courseId}`, {categoryId: `${selectedOption?.value}`})
			toast.success("Course updated");
			toggleEdit();
			router.refresh();
		}
		catch {
			toast.error("Something went wrong");
		}
	}

	const selectedOption = options.find((option) => option.value === initialData.categoryId);

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course category
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit category
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className={cn(
					"text-sm mt-2",
					!initialData.categoryId && "text-slate-500 italic"
				)}>
					{selectedOption?.label || "No category"}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select onValueChange={field.onChange}>
											<SelectTrigger className="border border-blue-200 bg-white rounded-md py-2 px-5 w-full">
												<SelectValue placeholder="Select option..." />
											</SelectTrigger>
											<SelectContent>
												{options?.map((option) => (
													<SelectItem key={option.value} value={option.label}>{option.label}</SelectItem>
												))}
											</SelectContent>
										</Select>

									</FormControl>
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button
								disabled={!isValid || isSubmitting}
								type="submit"
							>
								save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	)
}

export default CategoryForm