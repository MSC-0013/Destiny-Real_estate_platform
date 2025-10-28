import gradio as gr
import torch
import os
import time
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer
from datasets import load_dataset

# --- CONFIGURATION OPTIMIZED FOR SPEED AND PERFORMANCE ---
MODEL_NAME = "google/flan-t5-base"  # A more powerful and capable model than 'small'
DATA_FILE = "training_data.jsonl"
OUTPUT_DIR = "./pal-chatbot-trained"

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔧 Using device: {device}")

def train_model():
    """The main training function, optimized for performance."""
    
    # --- PERFORMANCE CHECK ---
    # If the model is already trained, don't re-run it.
    if os.path.exists(OUTPUT_DIR):
        yield "✅ **Model is already trained!** Check the 'Files' tab to download it."
        return

    yield "🚀 **Initializing high-performance training...**"
    yield f"🧠 Using model: `{MODEL_NAME}` on device: `{device}`"

    # --- STEP 1: LOAD DATA AND MODEL ---
    yield "📂 Loading dataset and model..."
    dataset = load_dataset('json', data_files=DATA_FILE)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

    # --- STEP 2: TOKENIZE DATA ---
    def preprocess_function(examples):
        # Tokenize prompts and responses
        model_inputs = tokenizer(examples["prompt"], max_length=64, truncation=True, padding="max_length")
        labels = tokenizer(text_target=examples["response"], max_length=128, truncation=True, padding="max_length")
        model_inputs["labels"] = labels["input_ids"]
        return model_inputs

    yield "🔄 Tokenizing data..."
    tokenized_dataset = dataset.map(preprocess_function, batched=True)

    # --- STEP 3: CONFIGURE TRAINING FOR MAXIMUM SPEED ---
    training_args = Seq2SeqTrainingArguments(
        output_dir=OUTPUT_DIR,
        report_to="none",  # Disable reporting for speed
        
        # --- KEY PERFORMANCE SETTINGS ---
        per_device_train_batch_size=8,      # Larger batch size = faster GPU utilization
        dataloader_num_workers=2,           # Use multiple CPU cores to load data faster
        fp16=True,                          # Use mixed-precision for faster calculations
        
        # --- TRAINING PARAMETERS ---
        num_train_epochs=8,                  # Enough epochs to learn well without overfitting
        save_total_limit=1,
        logging_steps=10,                    # Log progress every 10 steps
        
        # --- OPTIMIZER AND SCHEDULER ---
        learning_rate=5e-4,                  # A slightly higher learning rate for faster convergence
        weight_decay=0.01,
        warmup_steps=50,                     # Helps the model stabilize at the beginning of training
    )

    # --- STEP 4: CREATE TRAINER AND START ---
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        processing_class=tokenizer,
    )
    
    yield "🏁 **Starting training!** This will be fast. Check the 'Logs' tab for live progress."
    start_time = time.time()
    
    trainer.train()
    
    end_time = time.time()
    total_time = end_time - start_time

    # --- STEP 5: SAVE THE FINAL MODEL ---
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    yield f"🎉 **Training complete!** It took {total_time:.2f} seconds."
    yield f"💾 **Model saved successfully!** Check the 'Files' tab to download your trained model (`{OUTPUT_DIR}`)."

# --- CREATE THE GRADIO WEB INTERFACE ---
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown(
        """
        # 🚀 High-Performance AI Trainer
        Click the button below to fine-tune a powerful chatbot model on your personal data.
        This process is optimized for speed and performance on the Hugging Face Spaces T4 GPU.
        """
    )
    
    with gr.Row():
        train_button = gr.Button("🚀 Start High-Performance Training", variant="primary", size="lg")
    
    output_log = gr.Markdown(label="Training Status", value="Ready to train.")
    
    train_button.click(fn=train_model, outputs=output_log)

# Launch the web app
demo.launch()