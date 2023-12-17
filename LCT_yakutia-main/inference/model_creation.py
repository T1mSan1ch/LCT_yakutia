from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
import torch

MODEL_NAME = "IlyaGusev/saiga_mistral_7b"
config = PeftConfig.from_pretrained(MODEL_NAME, cache_dir = 'models')
model = AutoModelForCausalLM.from_pretrained(
    config.base_model_name_or_path,
    torch_dtype=torch.float16,
    device_map="auto",
    cache_dir = 'models'
)

model = PeftModel.from_pretrained(
    model,
    MODEL_NAME,
    torch_dtype=torch.float16,
    cache_dir = 'models'
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False, cache_dir = 'models')
generation_config = GenerationConfig.from_pretrained(MODEL_NAME, cache_dir = 'models')
print(generation_config)